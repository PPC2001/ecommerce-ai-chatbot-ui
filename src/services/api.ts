/**
 * Typed API client for the E-Commerce AI Chatbot backend.
 *
 * Security:
 * - All requests go to backend BFF — no LLM keys on the client
 * - No credentials stored in localStorage or sessionStorage
 * - Uses HTTPS in production (configured via VITE_API_BASE_URL env var)
 */

import type {
  ChatRequest,
  ChatResponse,
  HealthResponse,
  ProductListResponse,
  Product,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    },
    // NOTE: credentials: 'omit' — we don't use cookies for auth (stateless API)
    credentials: 'omit',
  });

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      detail = body?.detail ?? detail;
    } catch {
      // Ignore JSON parse errors on error responses
    }
    throw new ApiError(response.status, detail);
  }

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Chat API
// ---------------------------------------------------------------------------

export async function sendChatMessage(payload: ChatRequest): Promise<ChatResponse> {
  return request<ChatResponse>('/api/chat', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function checkHealth(): Promise<HealthResponse> {
  return request<HealthResponse>('/api/health');
}

// ---------------------------------------------------------------------------
// Products API
// ---------------------------------------------------------------------------

export interface ProductsQuery {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export async function fetchProducts(query: ProductsQuery = {}): Promise<ProductListResponse> {
  const params = new URLSearchParams();
  if (query.category) params.set('category', query.category);
  if (query.search) params.set('search', query.search);
  if (query.minPrice !== undefined) params.set('min_price', String(query.minPrice));
  if (query.maxPrice !== undefined) params.set('max_price', String(query.maxPrice));
  if (query.inStockOnly) params.set('in_stock_only', 'true');
  if (query.page) params.set('page', String(query.page));
  if (query.pageSize) params.set('page_size', String(query.pageSize));

  const qs = params.toString();
  return request<ProductListResponse>(`/api/products${qs ? `?${qs}` : ''}`);
}

export async function fetchProduct(id: string): Promise<Product> {
  return request<Product>(`/api/products/${encodeURIComponent(id)}`);
}

export { ApiError };
