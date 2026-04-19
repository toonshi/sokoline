import jwt
import requests
from django.contrib.auth.models import User
from django.conf import settings
from rest_framework import authentication, exceptions

class ClerkAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return None

            token = auth_header.split(' ')[1]
            jwks_url = getattr(settings, 'CLERK_JWKS_URL', None)

            if not jwks_url:
                return None

            # Peek at the token header to see if it's likely a Clerk token
            # Clerk tokens usually use RS256 and have a 'kid'
            unverified_header = jwt.get_unverified_header(token)
            if unverified_header.get('alg') != 'RS256':
                return None  # Fall back to other authentication classes (like JWT)

            # Fetch the JWKS (Public Keys) from Clerk
            jwks_client = jwt.PyJWKClient(jwks_url)
            signing_key = jwks_client.get_signing_key_from_jwt(token)

            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=['RS256'],
                options={'verify_aud': False}
            )

            clerk_id = payload.get('sub')
            if not clerk_id:
                return None

            # Match or Create Django User
            user, created = User.objects.get_or_create(username=clerk_id)
            
            # Sync details
            email = payload.get('email')
            first_name = payload.get('first_name', '')
            last_name = payload.get('last_name', '')

            if email: user.email = email
            if first_name: user.first_name = first_name
            if last_name: user.last_name = last_name
                
            if email or first_name or last_name:
                user.save()

            return (user, None)
        except Exception:
            return None
