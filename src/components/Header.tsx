import { ShoppingBag, Sparkles, Menu, X } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Header({ cartCount, onToggleSidebar, sidebarOpen }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <div className="header-logo">
          <div className="logo-icon">
            <Sparkles size={20} />
          </div>
          <div className="logo-text">
            <span className="logo-name">ShopBot</span>
            <span className="logo-tagline">AI Shopping Assistant</span>
          </div>
        </div>

        {/* Center badge */}
        <div className="header-badge">
          <div className="badge-dot" />
          <span>Powered by Gemini 2.5 Pro</span>
        </div>

        {/* Actions */}
        <div className="header-actions">
          <button
            id="sidebar-toggle"
            className="header-btn"
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? 'Close catalog' : 'Open catalog'}
            title={sidebarOpen ? 'Close Catalog' : 'Browse Catalog'}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            <span className="header-btn-label">Catalog</span>
          </button>

          <button
            id="cart-btn"
            className="header-btn cart-btn"
            aria-label={`Shopping cart, ${cartCount} items`}
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="cart-badge" aria-live="polite">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
