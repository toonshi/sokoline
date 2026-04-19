import json
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Order

logger = logging.getLogger(__name__)

@csrf_exempt
def mpesa_callback(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body)
        logger.info(f"M-Pesa Callback received: {json.dumps(data)}")

        stk_callback = data.get('Body', {}).get('stkCallback', {})
        result_code = stk_callback.get('ResultCode')
        checkout_request_id = stk_callback.get('CheckoutRequestID')

        try:
            order = Order.objects.get(checkout_request_id=checkout_request_id)
        except Order.DoesNotExist:
            logger.error(f"Order with checkout_request_id {checkout_request_id} not found")
            return JsonResponse({"status": "error", "message": "Order not found"}, status=404)

        if result_code == 0:
            # Success
            order.payment_status = 'SUCCESS'
            order.status = 'COMPLETED'
            
            # Extract receipt number
            callback_metadata = stk_callback.get('CallbackMetadata', {}).get('Item', [])
            for item in callback_metadata:
                if item.get('Name') == 'MpesaReceiptNumber':
                    order.mpesa_receipt_number = item.get('Value')
                    break
            
            order.save()
            logger.info(f"Order {order.id} payment successful. Receipt: {order.mpesa_receipt_number}")
        else:
            # Failure
            order.payment_status = 'FAILED'
            order.save()
            logger.warning(f"Order {order.id} payment failed. ResultCode: {result_code}")

        return JsonResponse({"status": "ok"})

    except Exception as e:
        logger.error(f"Error in M-Pesa Callback: {str(e)}")
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
