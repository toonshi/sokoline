from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views, payment_views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'tags', views.TagViewSet)
router.register(r'shops', views.ShopViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'product-faqs', views.ProductFAQViewSet)
router.register(r'reviews', views.ReviewViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'cart', views.CartViewSet, basename='cart')
router.register(r'cart-items', views.CartItemViewSet, basename='cart-item')
router.register(r'orders', views.OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('mpesa/callback/', payment_views.mpesa_callback, name='mpesa_callback'),
]
