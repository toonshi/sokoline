from django.urls import path
from .views import ProductListView, ProductDetailView, ProductCreateView, product_purchase_view

urlpatterns = [
    path('', ProductListView.as_view(), name='product_list'),
    path('new/', ProductCreateView.as_view(), name='product_create'),
    path('buy/<int:pk>/', product_purchase_view, name='product_purchase'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product_detail'),
]
