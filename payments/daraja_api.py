import requests
import base64
from django.conf import settings
from django.utils import timezone
from datetime import datetime
from .models import AccessToken, LipaNaMpesaOnline # Import LipaNaMpesaOnline

def get_access_token():
    # Check for a valid token in the database
    latest_token = AccessToken.objects.order_by('-created_at').first()
    if latest_token and latest_token.is_valid():
        return latest_token.token

    # If no valid token, request a new one
    consumer_key = settings.DARAJA_CONSUMER_KEY
    consumer_secret = settings.DARAJA_CONSUMER_SECRET
    api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

    try:
        response = requests.get(api_url, headers={
            'Authorization': 'Basic ' + base64.b64encode(f"{consumer_key}:{consumer_secret}".encode()).decode()
        })
        response.raise_for_status() # Raise an exception for HTTP errors (4xx or 5xx)

        data = response.json()
        token = data.get('access_token')
        expires_in = data.get('expires_in')

        if token and expires_in:
            # Save the new token to the database
            AccessToken.objects.create(token=token, expires_in=expires_in, created_at=timezone.now())
            return token
        else:
            raise Exception("Failed to retrieve access token: Missing token or expiry information.")

    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to connect to Daraja API for access token: {e}")
    except Exception as e:
        raise Exception(f"An unexpected error occurred while getting access token: {e}")

def initiate_stk_push(phone_number, amount, transaction_desc, account_reference, callback_url, user=None):
    access_token = get_access_token()
    if not access_token:
        raise Exception("Failed to get Daraja access token.")

    api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode(f"{settings.DARAJA_SHORTCODE}{settings.DARAJA_PASSKEY}{timestamp}".encode()).decode()

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # Ensure phone number is in the format 254xxxxxxxxx
    if phone_number.startswith('07'):
        phone_number = '254' + phone_number[1:]
    elif phone_number.startswith('+2547'):
        phone_number = phone_number[1:]

    payload = {
        "BusinessShortCode": settings.DARAJA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount), # Amount must be an integer
        "PartyA": phone_number,
        "PartyB": settings.DARAJA_SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": callback_url,
        "AccountReference": account_reference,
        "TransactionDesc": transaction_desc
    }

    try:
        response = requests.post(api_url, json=payload, headers=headers)
        response.raise_for_status()

        data = response.json()

        # Save the transaction details immediately after initiation
        LipaNaMpesaOnline.objects.create(
            user=user,
            merchant_request_id=data.get('MerchantRequestID'),
            checkout_request_id=data.get('CheckoutRequestID'),
            phone_number=phone_number,
            amount=amount,
            # result_code, result_desc, mpesa_receipt_number, transaction_date will be updated by callback
        )
        return data

    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to connect to Daraja API for STK Push: {e}")
    except Exception as e:
        raise Exception(f"An unexpected error occurred while initiating STK Push: {e}")
