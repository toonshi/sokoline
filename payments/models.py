from django.db import models
from django.utils import timezone
from django.conf import settings # Import settings to link to CustomUser

class AccessToken(models.Model):
    token = models.CharField(max_length=255)
    expires_in = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.token

    def is_valid(self):
        # Tokens are typically valid for 3600 seconds (1 hour)
        # We'll consider it expired a bit before to be safe
        expiry_time = self.created_at + timezone.timedelta(seconds=self.expires_in - 300) # 5 minutes buffer
        return timezone.now() < expiry_time

class LipaNaMpesaOnline(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    checkout_request_id = models.CharField(max_length=100, blank=True, null=True)
    merchant_request_id = models.CharField(max_length=100, blank=True, null=True)
    result_code = models.IntegerField(blank=True, null=True)
    result_desc = models.TextField(blank=True, null=True)
    mpesa_receipt_number = models.CharField(max_length=30, blank=True, null=True)
    transaction_date = models.DateTimeField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.phone_number} - {self.mpesa_receipt_number or 'Pending'}"

