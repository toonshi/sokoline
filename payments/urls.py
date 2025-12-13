from django.urls import path
from . import views

urlpatterns = [
    path('stk_push_callback/', views.stk_push_callback, name='stk_push_callback'),
    path('initiate/', views.initiate_payment, name='initiate_payment'),
]
