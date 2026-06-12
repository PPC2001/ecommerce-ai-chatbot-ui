import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { ProductCatalog } from './components/ProductCatalog';
import { useChat } from './hooks/useChat';
import { useProducts } from './hooks/useProducts';
import type { Product } from './types';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const {
    messages,
    isLoading: chatLoading,
    error: chatError,
    sendMessage,
    clearChat,
  } = useChat();

  const {
    products,
    total,
    page,
    isLoading: productsLoading,
    error: productsError,
    filters,
    updateFilters,
    resetFilters,
    setPage,
  } = useProducts();

  const handleAddToCart = useCallback((product: Product) => {
    setCartCount((prev) => prev + 1);
    // Inform the chat about the cart action for context
    sendMessage(`I just added "${product.name}" to my cart. Can you tell me more about it or suggest similar items?`);
  }, [sendMessage]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="app-root">
      <Header
        cartCount={cartCount}
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />

      <div className="app-layout">
        {/* Main Chat */}
        <ChatInterface
          messages={messages}
          isLoading={chatLoading}
          error={chatError}
          onSendMessage={sendMessage}
          onClearChat={clearChat}
        />

        {/* Catalog Sidebar */}
        <div className={`sidebar-wrapper ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <ProductCatalog
            products={products}
            total={total}
            page={page}
            isLoading={productsLoading}
            error={productsError}
            filters={filters}
            onFilterChange={updateFilters}
            onResetFilters={resetFilters}
            onPageChange={setPage}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
