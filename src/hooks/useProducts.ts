import { useState, useEffect, useCallback } from 'react';
import type { Product, FilterState } from '../types';
import { fetchProducts } from '../services/api';

const DEFAULT_FILTERS: FilterState = {
  category: '',
  search: '',
  minPrice: '',
  maxPrice: '',
  inStockOnly: false,
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const loadProducts = useCallback(async (f: FilterState, p: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchProducts({
        category: f.category || undefined,
        search: f.search || undefined,
        minPrice: f.minPrice ? parseFloat(f.minPrice) : undefined,
        maxPrice: f.maxPrice ? parseFloat(f.maxPrice) : undefined,
        inStockOnly: f.inStockOnly,
        page: p,
        pageSize: 12,
      });

      setProducts(result.products);
      setTotal(result.total);
    } catch {
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(filters, page);
  }, [filters, page, loadProducts]);

  const updateFilters = useCallback((update: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...update }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  return {
    products,
    total,
    isLoading,
    error,
    filters,
    page,
    setPage,
    updateFilters,
    resetFilters,
  };
}
