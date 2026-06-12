export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ProductRating {
  score: number;
  count: number;
}

export type ProductCategory =
  | 'Electronics'
  | 'Clothing'
  | 'Home & Garden'
  | 'Sports & Outdoors'
  | 'Books'
  | 'Beauty & Personal Care';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category: ProductCategory;
  tags: string[];
  rating: ProductRating;
  in_stock: boolean;
  stock_count: number;
  image_url: string;
  brand: string;
  sku: string;
  discount_percent?: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  page_size: number;
}

export interface ChatRequest {
  message: string;
  conversation_history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  session_id?: string;
}

export interface ChatResponse {
  message: string;
  session_id?: string;
  suggested_products?: string[];
}

export interface HealthResponse {
  status: string;
  version: string;
  environment: string;
}

export type FilterState = {
  category: string;
  search: string;
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
};
