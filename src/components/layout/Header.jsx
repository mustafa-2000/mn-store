function Header({ cartCount, wishlistCount = 0, onCartClick, onAccountClick }) {
  return (
    <header className="header">
      <a className="logo" href="#home" aria-label="MN Store home">
        MN<span>STORE.</span>
      </a>

      <nav className="nav-links" aria-label="Main navigation">
        <a className="active" href="#home">
          Home
        </a>
        <a href="#categories">Categories</a>
        <a href="#products">Shop</a>
        <a href="#wishlist">Wishlist</a>
        <a href="#footer">About</a>
      </nav>

      <div className="header-actions">
        <a
          className="search-link"
          href="#search"
          onClick={() => document.getElementById("product-search")?.focus()}
        >
          ⌕ <span>Search</span>
        </a>

        <button
          type="button"
          className="mn-account-link"
          aria-label="Open your account"
          onClick={onAccountClick}
        >
          ♙
        </button>

        <a
          className="wishlist-link"
          href="#wishlist"
          aria-label={`Wishlist with ${wishlistCount} products`}
        >
          <span aria-hidden="true">♡</span>
          <span className="wishlist-count">{wishlistCount}</span>
        </a>

        <button
          type="button"
          className="cart-link"
          onClick={onCartClick}
          aria-label={`Open shopping cart with ${cartCount} items`}
        >
          ♧ <span className="cart-count">{cartCount}</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
