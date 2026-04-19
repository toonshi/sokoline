export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_feature: boolean;
}

export interface ProductVariant {
  id: number;
  name: string;
  color_name: string;
  color_hex: string;
  size: string;
  price_override: string | null;
  stock: number;
  image: number | null;
  image_url: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  discount_price: string | null;
  is_on_sale: boolean;
  stock: number;
  shop: number;
  shop_name: string;
  shop_slug: string;
  category: Category | null;
  tags: Tag[];
  images: ProductImage[];
  variants: ProductVariant[];
  shipping_info: string;
  return_policy: string;
  has_free_shipping: boolean;
  has_free_returns: boolean;
  is_safety_certified: boolean;
  average_rating: number;
  review_count: number;
  created_at: string;
}

export interface Review {
  id: number;
  user: User;
  rating: number;
  comment: string;
  created_at: string;
}

export interface CartItem {
  id: number;
  product: number;
  product_name: string;
  unit_price: string;
  quantity: number;
  total_price: number;
}

export interface Cart {
  id: number;
  user: number;
  items: CartItem[];
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product: number | null;
  product_name: string;
  quantity: number;
  price: string;
}

export interface Order {
  id: number;
  user: number;
  items: OrderItem[];
  total_price: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  payment_status: 'PENDING' | 'SUCCESS' | 'FAILED';
  mpesa_receipt_number?: string;
  phone_number?: string;
  created_at: string;
}

export interface Shop {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  logo?: string;
  owner: number;
  products?: any[];
}
