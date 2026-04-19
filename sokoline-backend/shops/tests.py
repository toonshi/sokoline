from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from django.utils.text import slugify
from .models import Category, Tag, Shop, Product, ProductVariant, ProductImage, Review, Cart, CartItem, Order

class ProductPDPTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.owner = User.objects.create_user(username='vendor', password='password123')
        self.category = Category.objects.create(name="Tech", slug="tech")
        self.shop = Shop.objects.create(name="Venture Shop", owner=self.owner, slug="venture-shop")
        self.tag = Tag.objects.create(name="Sale")
        
        self.product = Product.objects.create(
            name="Professional Goggles",
            price="100.00",
            discount_price="80.00",
            shop=self.shop,
            category=self.category,
            shipping_info="Free local delivery",
            return_policy="7-day exchange"
        )
        self.product.tags.add(self.tag)
        
        # Add a variant
        self.variant = ProductVariant.objects.create(
            product=self.product,
            name="Crimson Red",
            color_name="Crimson",
            color_hex="#FF0000",
            stock=50
        )
        
        # Add a review
        self.review = Review.objects.create(
            product=self.product,
            user=self.user,
            rating=5,
            comment="Amazing student quality!"
        )

    def test_product_detail_hydration(self):
        """Verify the product endpoint returns all rich fields for PDP."""
        url = reverse('product-detail', args=[self.product.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['slug'], "professional-goggles")
        self.assertEqual(response.data['discount_price'], "80.00")
        self.assertEqual(response.data['is_on_sale'], True)
        self.assertEqual(len(response.data['variants']), 1)
        self.assertEqual(response.data['variants'][0]['name'], "Crimson Red")
        self.assertEqual(response.data['average_rating'], 5.0)
        self.assertEqual(response.data['review_count'], 1)
        self.assertEqual(response.data['shipping_info'], "Free local delivery")

    def test_related_products_logic(self):
        """Test the recommendation engine returns items in same category."""
        other_product = Product.objects.create(
            name="Other Tech Item",
            price="50.00",
            shop=self.shop,
            category=self.category
        )
        
        url = reverse('product-related-products', args=[self.product.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Other Tech Item")

    def test_review_pagination(self):
        """Verify reviews support offset-based pagination."""
        # Create 10 more reviews
        for i in range(10):
            u = User.objects.create_user(username=f'user{i}', password='p')
            Review.objects.create(product=self.product, user=u, rating=4, comment="Cool")
            
        url = reverse('review-list')
        response = self.client.get(url, {'product': self.product.id, 'limit': 5, 'offset': 0})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 5)
        self.assertIn('next', response.data)

class ShopPermissionsTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username='owner', password='password123')
        self.hacker = User.objects.create_user(username='hacker', password='password123')
        self.shop = Shop.objects.create(name="Owner Shop", owner=self.owner)
        self.category = Category.objects.create(name="Generic")

    def test_unauthorized_product_creation(self):
        """Ensure users cannot post products to shops they don't own."""
        self.client.force_authenticate(user=self.hacker)
        url = reverse('product-list')
        data = {
            'name': 'Hacked Item',
            'description': 'Should fail',
            'price': '999.00',
            'shop': self.shop.id,
            'category': self.category.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class CartTransactionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='buyer', password='password123')
        self.owner = User.objects.create_user(username='vendor', password='password123')
        self.shop = Shop.objects.create(name="Vendor", owner=self.owner)
        self.product = Product.objects.create(name="Gear", price="50.00", shop=self.shop)
        self.cart = Cart.objects.create(user=self.user)
        self.client.force_authenticate(user=self.user)

    def test_atomic_checkout(self):
        """Test cart items are converted to order and cleared."""
        CartItem.objects.create(cart=self.cart, product=self.product, quantity=2)
        
        url = reverse('cart-checkout')
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.filter(user=self.user).count(), 1)
        self.assertEqual(CartItem.objects.filter(cart=self.cart).count(), 0)
        self.assertEqual(response.data['total_price'], "100.00")
