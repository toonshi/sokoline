import requests
import base64
from datetime import datetime
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class DarajaClient:
    def __init__(self):
        self.consumer_key = getattr(settings, 'MPESA_CONSUMER_KEY', '')
        self.consumer_secret = getattr(settings, 'MPESA_CONSUMER_SECRET', '')
        self.shortcode = getattr(settings, 'MPESA_SHORTCODE', '174379')
        self.passkey = getattr(settings, 'MPESA_PASSKEY', '')
        self.env = getattr(settings, 'MPESA_ENVIRONMENT', 'sandbox')
        
        if self.env == 'sandbox':
            self.base_url = 'https://sandbox.safaricom.co.ke'
        else:
            self.base_url = 'https://api.safaricom.co.ke'

    def get_token(self):
        api_url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
        try:
            res = requests.get(api_url, auth=(self.consumer_key, self.consumer_secret))
            res.raise_for_status()
            return res.json().get('access_token')
        except Exception as e:
            logger.error(f"Failed to get Daraja token: {e}")
            return None

    def stk_push(self, phone_number, amount, callback_url, account_ref, transaction_desc):
        token = self.get_token()
        if not token:
            return None

        api_url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = base64.b64encode(f"{self.shortcode}{self.passkey}{timestamp}".encode()).decode()

        headers = {"Authorization": f"Bearer {token}"}
        
        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": phone_number,
            "PartyB": self.shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": callback_url,
            "AccountReference": account_ref,
            "TransactionDesc": transaction_desc
        }

        try:
            res = requests.post(api_url, json=payload, headers=headers)
            res.raise_for_status()
            return res.json()
        except Exception as e:
            logger.error(f"STK Push failed: {e}")
            if hasattr(e, 'response') and e.response is not None:
                logger.error(f"Response: {e.response.text}")
            return None
