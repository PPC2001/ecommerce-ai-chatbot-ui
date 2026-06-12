import { ShoppingCart, Package, Tag } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const discountPercent = product.discount_percent;
  const hasDiscount = discountPercent !== undefined && discountPercent > 0;

  function renderStars(score: number) {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`star ${i < Math.floor(score) ? 'star-filled' : i < score ? 'star-half' : 'star-empty'}`}
        aria-hidden="true"
      >
        ★
      </span>
    ));
  }

  return (
    <article className="product-card" aria-label={product.name}>
      {/* Image */}
      <div className="product-image-wrapper">
        <img
          src={product.image_url}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            // Fallback image on load error
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
          }}
        />
        {hasDiscount && (
          <span className="discount-badge" aria-label={`${discountPercent}% off`}>
            -{discountPercent}%
          </span>
        )}
        {!product.in_stock && (
          <div className="out-of-stock-overlay">
            <span>Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="product-content">
        {/* Category */}
        <div className="product-meta">
          <span className="product-category">
            <Tag size={10} />
            {product.category}
          </span>
          <span className="product-brand">{product.brand}</span>
        </div>

        {/* Name */}
        <h3 className="product-name">{product.name}</h3>

        {/* Rating */}
        <div className="product-rating" aria-label={`Rating: ${product.rating.score} out of 5`}>
          <div className="stars" aria-hidden="true">
            {renderStars(product.rating.score)}
          </div>
          <span className="rating-score">{product.rating.score.toFixed(1)}</span>
          <span className="rating-count">({product.rating.count.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="product-price">
          <span className="price-current">${product.price.toFixed(2)}</span>
          {hasDiscount && product.original_price && (
            <span className="price-original">${product.original_price.toFixed(2)}</span>
          )}
        </div>

        {/* Stock */}
        <div className="product-stock">
          <Package size={12} />
          {product.in_stock ? (
            <span className="in-stock">
              {product.stock_count > 10
                ? 'In Stock'
                : `Only ${product.stock_count} left`}
            </span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          id={`add-to-cart-${product.id}`}
          className="add-to-cart-btn"
          onClick={() => onAddToCart?.(product)}
          disabled={!product.in_stock}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart size={14} />
          {product.in_stock ? 'Add to Cart' : 'Unavailable'}
        </button>
      </div>
    </article>
  );
}
