import json
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import LipaNaMpesaOnline
from .daraja_api import initiate_stk_push # Import the initiation function
from products.models import Product # Import Product model

@csrf_exempt
def stk_push_callback(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            callback_metadata = data.get('Body', {}).get('stkCallback', {})
            merchant_request_id = callback_metadata.get('MerchantRequestID')
            checkout_request_id = callback_metadata.get('CheckoutRequestID')
            result_code = callback_metadata.get('ResultCode')
            result_desc = callback_metadata.get('ResultDesc')
            callback_items = callback_metadata.get('CallbackMetadata', {}).get('Item', [])

            mpesa_receipt_number = None
            transaction_date = None
            phone_number = None
            amount = None

            for item in callback_items:
                if item.get('Name') == 'MpesaReceiptNumber':
                    mpesa_receipt_number = item.get('Value')
                elif item.get('Name') == 'TransactionDate':
                    # Example format: 20170519083300
                    transaction_date_str = item.get('Value')
                    if transaction_date_str:
                        transaction_date = timezone.datetime.strptime(transaction_date_str, '%Y%m%d%H%M%S')
                elif item.get('Name') == 'PhoneNumber':
                    phone_number = item.get('Value')
                elif item.get('Name') == 'Amount':
                    amount = item.get('Value')

            try:
                transaction = LipaNaMpesaOnline.objects.get(
                    merchant_request_id=merchant_request_id,
                    checkout_request_id=checkout_request_id
                )
                transaction.result_code = result_code
                transaction.result_desc = result_desc
                transaction.mpesa_receipt_number = mpesa_receipt_number
                transaction.transaction_date = transaction_date
                transaction.phone_number = phone_number # Update in case it wasn't set or changed
                transaction.amount = amount # Update in case it wasn't set or changed
                transaction.save()
            except LipaNaMpesaOnline.DoesNotExist:
                # Log this or handle it if a callback comes for an unknown transaction
                pass # For now, we'll just pass

            return JsonResponse({"ResultCode": 0, "ResultDesc": "Callback received successfully"})

        except json.JSONDecodeError:
            return JsonResponse({"ResultCode": 1, "ResultDesc": "Invalid JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"ResultCode": 1, "ResultDesc": f"Error processing callback: {str(e)}"}, status=500)
    
    return JsonResponse({"ResultCode": 1, "ResultDesc": "Invalid request method"}, status=405)

@csrf_exempt
def initiate_payment(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            product_id = data.get('product_id')
            phone_number = data.get('phone_number')

            if not product_id or not phone_number:
                return JsonResponse({"status": "error", "message": "Product ID and Phone Number are required."}, status=400)
            
            product = get_object_or_404(Product, pk=product_id)
            amount = product.price
            transaction_desc = f"Payment for {product.name}"
            account_reference = f"PROD-{product.pk}" # Unique reference for the transaction

            # Get the full URL for the callback
            # request.build_absolute_uri automatically handles http/https and domain
            callback_url = request.build_absolute_uri('/payments/stk_push_callback/')

            user = request.user if request.user.is_authenticated else None

            response_data = initiate_stk_push(
                phone_number=phone_number,
                amount=amount,
                transaction_desc=transaction_desc,
                account_reference=account_reference,
                callback_url=callback_url,
                user=user
            )
            return JsonResponse({"status": "success", "message": "STK Push initiated successfully.", "data": response_data})

        except Product.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Product not found."}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"status": "error", "message": f"Payment initiation failed: {str(e)}"}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)
