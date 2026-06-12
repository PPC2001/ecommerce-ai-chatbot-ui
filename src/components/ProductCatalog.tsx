import { Search, SlidersHorizontal, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Product, FilterState } from '../types';

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports & Outdoors',
  'Books',
  'Beauty & Personal Care',
];

interface ProductCatalogProps {
  products: Product[];
  total: number;
  page: number;
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
  onFilterChange: (update: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onPageChange: (page: number) => void;
  onAddToCart: (product: Product) => void;
}

const PAGE_SIZE = 12;

export function ProductCatalog({
  products,
  total,
  page,
  isLoading,
  error,
  filters,
  onFilterChange,
  onResetFilters,
  onPageChange,
  onAddToCart,
}: ProductCatalogProps) {
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasFilters =
    !!filters.category ||
    !!filters.search ||
    !!filters.minPrice ||
    !!filters.maxPrice ||
    filters.inStockOnly;

  return (
    <aside className="catalog-sidebar" aria-label="Product catalog">
      {/* Sidebar Header */}
      <div className="catalog-header">
        <div className="catalog-title">
          <SlidersHorizontal size={18} />
          <h2>Browse Products</h2>
          {total > 0 && <span className="catalog-count">{total}</span>}
        </div>
        {hasFilters && (
          <button
            id="reset-filters-btn"
            className="reset-filters-btn"
            onClick={onResetFilters}
            aria-label="Reset all filters"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      {/* Search */}
      <div className="catalog-search">
        <Search size={14} className="search-icon" />
        <input
          id="product-search"
          type="search"
          className="search-input"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => {
            // Input value is used as text content via React state — safe from XSS
            const val = e.target.value.slice(0, 200);
            onFilterChange({ search: val });
          }}
          aria-label="Search products"
          maxLength={200}
        />
      </div>

      {/* Category Filter */}
      <div className="filter-section">
        <label className="filter-label" htmlFor="category-filter">
          Category
        </label>
        <select
          id="category-filter"
          className="filter-select"
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <label className="filter-label">Price Range</label>
        <div className="price-range">
          <input
            id="min-price"
            type="number"
            className="filter-input"
            placeholder="Min $"
            value={filters.minPrice}
            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
            min={0}
            max={10000}
            aria-label="Minimum price"
          />
          <span className="price-separator">—</span>
          <input
            id="max-price"
            type="number"
            className="filter-input"
            placeholder="Max $"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            min={0}
            max={10000}
            aria-label="Maximum price"
          />
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="filter-section filter-toggle">
        <label className="toggle-label" htmlFor="in-stock-filter">
          In stock only
        </label>
        <button
          id="in-stock-filter"
          role="switch"
          aria-checked={filters.inStockOnly}
          className={`toggle-btn ${filters.inStockOnly ? 'toggle-on' : 'toggle-off'}`}
          onClick={() => onFilterChange({ inStockOnly: !filters.inStockOnly })}
        >
          <span className="toggle-thumb" />
        </button>
      </div>

      {/* Divider */}
      <hr className="catalog-divider" />

      {/* Product Grid */}
      <div className="catalog-grid-wrapper">
        {error && (
          <div className="catalog-error" role="alert">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="catalog-loading" aria-label="Loading products">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-card" aria-hidden="true">
                <div className="skeleton skeleton-image" />
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-price" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="catalog-empty" role="status">
            <Search size={40} />
            <p>No products found</p>
            <span>Try adjusting your filters</span>
          </div>
        ) : (
          <div className="catalog-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="catalog-pagination" role="navigation" aria-label="Product pages">
          <button
            id="prev-page-btn"
            className="page-btn"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="page-indicator">
            {page} / {totalPages}
          </span>
          <button
            id="next-page-btn"
            className="page-btn"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </aside>
  );
}
