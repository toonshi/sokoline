from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.pagination import LimitOffsetPagination
from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import Q
from .models import Category, Shop, Product, Cart, CartItem, Order, OrderItem, Review, Tag, ProductVariant, ProductImage, ProductFAQ
from .serializers import (
    CategorySerializer, ShopSerializer, ProductSerializer, 
    UserSerializer, CartSerializer, CartItemSerializer,
    OrderSerializer, OrderItemSerializer, ReviewSerializer,
    TagSerializer, ProductVariantSerializer, ProductImageSerializer,
    ProductFAQSerializer
)

class UserViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class ProductFAQViewSet(viewsets.ModelViewSet):
    queryset = ProductFAQ.objects.all()
    serializer_class = ProductFAQSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all().select_related('owner').prefetch_related('products')
    serializer_class = ShopSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().select_related('shop', 'category').prefetch_related('images', 'variants', 'tags', 'reviews', 'faqs')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    search_fields = ['name', 'description', 'category__name', 'tags__name']

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        shop = self.request.query_params.get('shop')
        if category:
            queryset = queryset.filter(category__slug=category)
        if shop:
            queryset = queryset.filter(shop__slug=shop)
        return queryset

    def perform_create(self, serializer):
        shop_id = self.request.data.get('shop')
        try:
            shop = Shop.objects.get(pk=shop_id, owner=self.request.user)
            serializer.save(shop=shop)
        except Shop.DoesNotExist:
            raise PermissionDenied('You do not own this shop.')

    @action(detail=True, methods=['get'])
    def related_products(self, request, pk=None):
        product = self.get_object()
        # Recommendation logic: Same category or overlapping tags
        related = Product.objects.filter(
            Q(category=product.category) | Q(tags__in=product.tags.all())
        ).exclude(id=product.id).distinct()[:4]
        
        serializer = self.get_serializer(related, many=True)
        return Response(serializer.data)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().select_related('user', 'product')
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        product_id = self.request.query_params.get('product')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset

    def perform_create(self, serializer):
        product_id = self.request.data.get('product')
        # Check if user has a COMPLETED order with this product
        has_purchased = OrderItem.objects.filter(
            order__user=self.request.user,
            order__status='COMPLETED',
            product_id=product_id
        ).exists()

        if not has_purchased:
            raise ValidationError("You can only review products you have purchased.")

        serializer.save(user=self.request.user)

from .daraja import DarajaClient

class CartViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user).prefetch_related('items__product')

    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def checkout(self, request):
        phone_number = request.data.get('phone_number')
        if not phone_number:
            raise ValidationError("Phone number is required for M-Pesa payment.")

        cart, created = Cart.objects.get_or_create(user=request.user)
        items = cart.items.all()

        if not items:
            raise ValidationError("Cannot checkout with an empty cart.")

        total_price = cart.total_price

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                total_price=total_price,
                status='PENDING',
                payment_status='PENDING',
                phone_number=phone_number
            )

            for cart_item in items:
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    quantity=cart_item.quantity,
                    price=cart_item.product.price
                )

            # Daraja STK Push
            daraja = DarajaClient()
            # Callback URL needs to be accessible by Safaricom
            callback_url = "https://sokoline.app/api/mpesa/callback/" 
            if settings.DEBUG:
                # For local testing, we might need ngrok, but for now we use a placeholder or the actual domain if set
                # In a real scenario, this would be an env var
                callback_url = getattr(settings, 'MPESA_CALLBACK_URL', callback_url)

            stk_res = daraja.stk_push(
                phone_number=phone_number,
                amount=total_price,
                callback_url=callback_url,
                account_ref=f"Order-{order.id}",
                transaction_desc=f"Payment for Order {order.id}"
            )

            if stk_res and stk_res.get('ResponseCode') == '0':
                order.checkout_request_id = stk_res.get('CheckoutRequestID')
                order.save()
                items.delete()
                serializer = OrderSerializer(order)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                transaction.set_rollback(True)
                return Response({
                    "error": "STK Push failed. Please check your phone number and try again.",
                    "details": stk_res
                }, status=status.HTTP_400_BAD_REQUEST)
class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user).select_related('product')

    def perform_create(self, serializer):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        product_id = self.request.data.get('product')
        quantity = int(self.request.data.get('quantity', 1))
        
        item = CartItem.objects.filter(cart=cart, product_id=product_id).first()
        if item:
            item.quantity += quantity
            item.save()
            serializer.instance = item
        else:
            serializer.save(cart=cart)

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items__product')

    @action(detail=True, methods=['get'])
    def payment_status(self, request, pk=None):
        order = self.get_object()
        return Response({
            'id': order.id,
            'payment_status': order.payment_status,
            'status': order.status
        })
