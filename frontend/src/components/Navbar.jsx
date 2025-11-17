import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { searchProducts } from '../services/api';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const searchWrapRefMobile = useRef(null);
  const searchWrapRefDesktop = useRef(null);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const readWishlistCount = () => {
      try {
        const raw = localStorage.getItem('wishlist');
        const list = raw ? JSON.parse(raw) : [];
        setWishlistCount(Array.isArray(list) ? list.length : 0);
      } catch {
        setWishlistCount(0);
      }
    };
    readWishlistCount();
    const onStorage = (e) => {
      if (!e || e.key === 'wishlist') readWishlistCount();
    };
    const onCustom = () => readWishlistCount();
    window.addEventListener('storage', onStorage);
    window.addEventListener('wishlist:updated', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('wishlist:updated', onCustom);
    };
  }, []);

  // Check authentication status - Using in-memory state instead of localStorage
  useEffect(() => {
    // You can integrate this with your authentication context/provider
    // For now, derive auth from localStorage token to keep Navbar in sync with Router guards
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        setIsAuthenticated(Boolean(token));
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    const onStorage = (e) => {
      if (!e || e.key === 'auth_token') {
        checkAuth();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    // Handle logout logic here
    // Example: authContext.logout();
    try {
      localStorage.removeItem('auth_token');
    } catch {}
    setIsAuthenticated(false);
    navigate('/signin');
  };

  const handleLogin = () => {
    navigate('/signin');
  };

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
    if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  // Debounced fetch for inline search results
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchOpen(false);
      return;
    }
    setSearchLoading(true);
    setSearchOpen(true);
    const t = setTimeout(async () => {
      try {
        const data = await searchProducts(q);
        const items = data?.results || [];
        setSearchResults(items);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      const inMobile = searchWrapRefMobile.current && searchWrapRefMobile.current.contains(e.target);
      const inDesktop = searchWrapRefDesktop.current && searchWrapRefDesktop.current.contains(e.target);
      if (!inMobile && !inDesktop) setSearchOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Navigation links with dropdowns
  const navLinks = [
    { 
      name: 'COLLECTION', 
      path: '/collections',
      subcategories: [
        { name: 'All Collections', path: '/collections' },
        { name: 'New Arrivals', path: '/collections?filter=new' },
        { name: 'Best Sellers', path: '/collections?filter=bestseller' },
      ]
    },
    { 
      name: 'MEN', 
      path: '/category/men',
      subcategories: [
        { name: 'All Men', path: '/category/men' },
        { name: 'Kurtas', path: '/category/men/kurtas' },
        { name: 'Shirts', path: '/category/men/shirts' },
      ]
    },
    { 
      name: 'WOMEN', 
      path: '/category/women',
      subcategories: [
        { name: 'All Women', path: '/category/women' },
        { name: 'Sarees', path: '/category/women/sarees' },
        { name: 'Dresses', path: '/category/women/dresses' },
      ]
    },
    { 
      name: 'BOYS', 
      path: '/category/boys',
      subcategories: [
        { name: 'All Boys', path: '/category/boys' },
        { name: 'Shirts', path: '/category/boys/shirts' },
        { name: 'T-Shirts', path: '/category/boys/tshirts' },
      ]
    },
    { 
      name: 'GIRLS', 
      path: '/category/girls',
      subcategories: [
        { name: 'All Girls', path: '/category/girls' },
        { name: 'Dresses', path: '/category/girls/dresses' },
        { name: 'Tops', path: '/category/girls/tops' },
      ]
    },
    { 
      name: 'SISHU', 
      path: '/category/sishu',
      subcategories: [
        { name: 'All Sishu', path: '/category/sishu' },
        { name: 'Infant Wear', path: '/category/sishu/infant' },
        { name: 'Toddler Wear', path: '/category/sishu/toddler' },
      ]
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <nav
      ref={navbarRef}
      className="relative z-[70] bg-white"
    >
      <div className="w-full max-w-7xl mx-auto pl-0 pr-0">
        <div className="relative flex items-center justify-between h-16 md:h-20">
          {/* Left Side: Logo + Navigation Links */}
          <div className="flex items-center space-x-4 md:space-x-6 lg:space-x-8">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img 
                src="https://res.cloudinary.com/duc9svg7w/image/upload/v1763362340/ParidhanLogo_fxrahv.png" 
                alt="Paridhan Logo" 
                className="h-10 sm:h-12 md:h-14 w-auto hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  <div 
                    className="flex items-center text-gray-700 hover:text-gray-900 font-medium text-sm uppercase tracking-wide cursor-pointer transition-colors duration-200"
                    onMouseEnter={() => setActiveDropdown(link.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    onClick={() => {
                      if (activeDropdown === link.name) {
                        setActiveDropdown(null);
                      } else {
                        setActiveDropdown(link.name);
                      }
                    }}
                  >
                    {link.name}
                    <svg
                      className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                        activeDropdown === link.name ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Dropdown Menu */}
                  {link.subcategories && activeDropdown === link.name && (
                    <div 
                      className="absolute left-0 top-full mt-1 z-50 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden min-w-[200px]"
                      onMouseEnter={() => setActiveDropdown(link.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {link.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.name}
                          to={subcategory.path}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden md:flex items-center flex-1 justify-center max-w-md mx-auto">
            <div className="relative w-64" ref={searchWrapRefDesktop}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => { 
                  const v = e.target.value; 
                  setSearchQuery(v); 
                  setSearchOpen(v.trim().length >= 2); 
                }}
                onKeyPress={handleSearchKeyPress}
                onFocus={() => { if (searchQuery.trim().length >= 2) setSearchOpen(true); }}
                className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
              />
              <button
                onClick={handleSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              {/* Search Results Dropdown */}
              {searchOpen && searchQuery.trim().length >= 2 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[80] overflow-hidden">
                  {searchLoading && (
                    <div className="px-4 py-3 text-sm text-gray-500">Searching…</div>
                  )}
                  {!searchLoading && searchResults.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500">No products found</div>
                  )}
                  {!searchLoading && searchResults.length > 0 && (
                    <ul className="divide-y divide-gray-100 max-h-96 overflow-auto">
                      {searchResults.slice(0, 8).map((p) => (
                        <li key={p._id || p.id || p.slug}>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchOpen(false);
                              navigate(`/product/${p._id || p.id || ''}`);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                          >
                            <img
                              src={p.images?.image1 || p.image || 'https://via.placeholder.com/60x80?text=No+Image'}
                              alt={p.title || p.name || 'Product'}
                              className="w-12 h-16 object-cover rounded-md border border-gray-100"
                              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/60x80?text=No+Image'; }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">{p.title || p.name || 'Product'}</p>
                              {p.price && (
                                <p className="text-xs text-gray-600">₹{Number(p.price).toLocaleString()}</p>
                              )}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 lg:space-x-3 flex-1 justify-end">

           
            {/* Wishlist Icon */}
            <Link 
              to="/wishlist" 
              className="p-2 text-gray-700 hover:text-gray-900 relative transition-colors duration-200"
              aria-label="Wishlist"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

            {/* Shopping Cart Icon */}
            <Link
              to="/cart" 
              className="p-2 text-gray-700 hover:text-gray-900 relative transition-colors duration-200 flex items-center"
              aria-label="Shopping Cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="ml-1 text-sm text-gray-700">({cartCount})</span>
            </Link>

            {/* Profile Icon */}
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                aria-label="Profile"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            ) : (
              <Link
                to="/signin"
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                aria-label="Sign In"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-6 bg-white shadow-lg">
            {/* Mobile Search */}
            <div className="px-4 mb-4">
              <div className="relative" ref={searchWrapRefMobile}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => { const v = e.target.value; setSearchQuery(v); setSearchOpen(v.trim().length >= 2); }}
                  onKeyPress={handleSearchKeyPress}
                  onFocus={() => { if (searchQuery.trim().length >= 2) setSearchOpen(true); }}
                  className="w-full px-3 py-2 pl-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <button
                  onClick={handleSearch}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  type="button"
                  aria-label="Search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {searchOpen && searchQuery.trim().length >= 2 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[80] overflow-hidden max-h-96">
                    {searchLoading && (
                      <div className="px-4 py-3 text-sm text-gray-500">Searching…</div>
                    )}
                    {!searchLoading && searchResults.length === 0 && (
                      <div className="px-4 py-3 text-sm text-gray-500">No products found</div>
                    )}
                    {!searchLoading && searchResults.length > 0 && (
                      <ul className="divide-y divide-gray-100 overflow-auto">
                        {searchResults.slice(0, 8).map((p) => (
                          <li key={p._id || p.id || p.slug}>
                            <button
                              type="button"
                              onClick={() => {
                                setSearchOpen(false);
                                setIsMobileMenuOpen(false);
                                navigate(`/product/${p._id || p.id || ''}`);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                            >
                              <img
                                src={p.images?.image1 || p.image || 'https://via.placeholder.com/60x80?text=No+Image'}
                                alt={p.title || p.name || 'Product'}
                                className="w-12 h-16 object-cover rounded-md border border-gray-100"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/60x80?text=No+Image'; }}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">{p.title || p.name || 'Product'}</p>
                                {p.price && (
                                  <p className="text-xs text-gray-600">₹{Number(p.price).toLocaleString()}</p>
                                )}
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="space-y-2 px-4">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <button
                    onClick={() => {
                      if (activeDropdown === link.name) {
                        setActiveDropdown(null);
                      } else {
                        setActiveDropdown(link.name);
                      }
                    }}
                    className="w-full flex items-center justify-between text-gray-700 hover:text-gray-900 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-sm uppercase tracking-wide"
                >
                  {link.name}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === link.name ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === link.name && link.subcategories && (
                    <div className="pl-4 space-y-1">
                      {link.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.name}
                          to={subcategory.path}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setActiveDropdown(null);
                          }}
                          className="block text-gray-600 hover:text-gray-900 py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                        >
                          {subcategory.name}
                </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Auth Section in Mobile Menu */}
            {isAuthenticated ? (
              <div className="mt-6 pt-6 px-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#800020] text-white rounded-lg font-medium hover:bg-[#660019] transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="mt-6 pt-6 px-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#800020] text-white rounded-lg font-medium hover:bg-[#660019] transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;