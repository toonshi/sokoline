from django.urls import path
from .views import SignUpView, profile, custom_logout

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('profile/', profile, name='profile'),
    path('logout/', custom_logout, name='logout'),
]
