import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRupeeSign, FaSpinner, FaFilter, FaTimes, FaChevronDown, FaChevronUp, FaHeart } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5'; 
import { fetchSarees } from '../services/api';

// Add CSS to hide scrollbar
const styles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const ProductList = ({ defaultCategory } = {}) => {
    const { categoryName, subCategoryName } = useParams();
    const navigate = useNavigate();
    
    // --- State Initialization ---
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    
    // Filter states
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [selectedFabrics, setSelectedFabrics] = useState([]);
    
    // Accordion states for desktop filters
    const [openSections, setOpenSections] = useState({
      price: true,
      material: true
    });
    
    // --- Constants ---
    const allPossibleFabrics = ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Linen', 'Satin', 'Velvet', 'Organza', 'Banarasi', 'Kanjivaram', 'Tussar', 'Maheshwari', 'Chanderi', 'Zari', 'Zardosi', 'Kalamkari', 'Bandhani', 'Patola', 'Paithani']; 
    
    const availableFabrics = React.useMemo(() => {
        const fabricSet = new Set();
        products.forEach(product => {
            const possibleFabricFields = [product.fabric, product.material, product.product_info?.fabric, product.product_info?.material, product.details?.fabric, product.details?.material, product.description, product.title];
            possibleFabricFields.forEach(field => {
                if (field) {
                    const fieldStr = String(field).toLowerCase();
                    allPossibleFabrics.forEach(fabric => {
                        if (fieldStr.includes(fabric.toLowerCase())) {
                            fabricSet.add(fabric);
                        }
                    });
                }
            });
        });
        if (fabricSet.size === 0) {
            return ['Silk', 'Cotton', 'Georgette'];
        }
        return Array.from(fabricSet).sort();
    }, [products]);
    
    const priceRanges = [
      { id: 1, label: '₹300 - ₹2,000', min: 300, max: 2000 },
      { id: 2, label: '₹2,001 - ₹5,000', min: 2001, max: 5000 },
      { id: 3, label: '₹5,001 - ₹10,000', min: 5001, max: 10000 },
      { id: 4, label: '₹10,001 - ₹25,000', min: 10001, max: 25000 },
      { id: 5, label: 'Above ₹25,000', min: 25001, max: Infinity },
    ];
    
    // --- Data Fetching (Keep function) ---
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchSarees(effectiveCategory || '');
                setProducts(data || []);
                setFilteredProducts(data || []);
            } catch (err) {
                console.error('Failed to load products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [categoryName, subCategoryName, defaultCategory]);

    // --- Utility Functions (Keep function) ---
    const normalize = (s) => {
        if (!s) return '';
        const t = s.replace(/-/g, ' ').toLowerCase();
        return t.replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const effectiveCategory = subCategoryName
        ? normalize(subCategoryName)
        : (categoryName || defaultCategory) ? normalize(categoryName || defaultCategory) : '';
    
    // --- Filter Application (Keep function) ---
    useEffect(() => {
        let result = [...products];
        
        // Filter by price range
        if (selectedPriceRange) {
            const range = priceRanges.find(r => r.id === selectedPriceRange);
            if (range) {
                result = result.filter(p => {
                    const price = p.price || (p.mrp - p.mrp * ((p.discountPercent || 0) / 100));
                    return price >= range.min && price <= range.max;
                });
            }
        }
        
        // Filter by fabric
        if (selectedFabrics.length > 0) {
            result = result.filter(p => {
                const possibleFabricFields = [p.fabric, p.material, p.product_info?.fabric, p.product_info?.material, p.details?.fabric, p.details?.material, p.description, p.title];
                const fabricSearchString = possibleFabricFields.filter(Boolean).map(String).join(' ').toLowerCase();
                return selectedFabrics.some(fabric => 
                    fabricSearchString.includes(fabric.toLowerCase())
                );
            });
        }
        
        setFilteredProducts(result);
    }, [products, selectedPriceRange, selectedFabrics]);
    
    // --- Filter Handlers (Keep function) ---
    const toggleFabric = (fabric) => {
        setSelectedFabrics(prev => 
            prev.includes(fabric)
              ? prev.filter(f => f !== fabric)
              : [...prev, fabric]
        );
    };
    
    const resetFilters = () => {
        setSelectedPriceRange(null);
        setSelectedFabrics([]);
    };

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [categoryName, subCategoryName]);

    const handleCardClick = (product) => {
        navigate(`/product/${product._id}`);
    };

    const activeFilterCount = [
        selectedFabrics.length,
        selectedPriceRange ? 1 : 0
    ].reduce((a, b) => a + b, 0);

    // --- Filter Content Component (Keep as is) ---
    const FilterContent = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center pb-2">
                <h3 className="text-xl font-serif italic text-gray-800 tracking-tight">Refine By</h3>
                {activeFilterCount > 0 && (
                    <button 
                        onClick={resetFilters}
                        className="text-sm text-amber-700 hover:text-amber-800 font-medium transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Price Range Filter */}
            <div className="border-t border-gray-200 pt-4">
                <button
                    onClick={() => toggleSection('price')}
                    className="flex justify-between items-center w-full mb-3 group"
                >
                    <h4 className="text-base font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">Price Range</h4>
                    {openSections.price ? <FaChevronUp className="text-gray-500 w-4 h-4" /> : <FaChevronDown className="text-gray-500 w-4 h-4" />}
                </button>
                
                {openSections.price && (
                    <div className="space-y-2">
                        {priceRanges.map(range => (
                            <div key={range.id} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`price-${range.id}`}
                                    name="priceRange"
                                    checked={selectedPriceRange === range.id}
                                    onChange={() => setSelectedPriceRange(range.id)}
                                    className="h-4 w-4 text-red-800 focus:ring-red-700 border-gray-300 cursor-pointer checked:bg-red-800"
                                    style={{ accentColor: '#7A2A2A' }}
                                />
                                <label htmlFor={`price-${range.id}`} className="ml-3 text-sm text-gray-700 cursor-pointer">
                                    {range.label}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Material Filter */}
            <div className="border-t border-gray-200 pt-4">
                <button
                    onClick={() => toggleSection('material')}
                    className="flex justify-between items-center w-full mb-3 group"
                >
                    <h4 className="text-base font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">Fabric/Material</h4>
                    <div className="flex items-center">
                        {selectedFabrics.length > 0 && (
                            <span className="mr-2 inline-flex items-center justify-center h-5 w-5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                                {selectedFabrics.length}
                            </span>
                        )}
                        {openSections.material ? <FaChevronUp className="text-gray-500 w-4 h-4" /> : <FaChevronDown className="text-gray-500 w-4 h-4" />}
                    </div>
                </button>
                
                {openSections.material && (
                    <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide border border-gray-100 p-3 rounded-md">
                        {availableFabrics && availableFabrics.length > 0 ? (
                            availableFabrics.map(material => (
                                <div key={material} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`material-${material}`}
                                        checked={selectedFabrics.includes(material)}
                                        onChange={() => toggleFabric(material)}
                                        className="h-4 w-4 text-red-800 focus:ring-red-700 border-gray-300 rounded cursor-pointer"
                                        style={{ accentColor: '#7A2A2A' }}
                                    />
                                    <label htmlFor={`material-${material}`} className="ml-3 text-sm text-gray-700 cursor-pointer">
                                        {material}
                                    </label>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No fabric options available</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500 text-xl font-semibold">❌ {error}</p>
        </div>
      );
    }

    // --- Main Render Block ---
    return (
        <div className="min-h-screen bg-stone-50">
            <style>{styles}</style>
            
            {/* Loading Bar */}
            {loading && (
                <div className="fixed left-0 right-0 top-0 z-50">
                    <div className="h-0.5 bg-gradient-to-r from-[#7A2A2A] via-[#A56E2C] to-[#C89D4B] animate-pulse"></div>
                </div>
            )}

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
                
                {/* Header - Sticky for continuous context */}
                <div className="mb-8 sticky top-0 bg-stone-50 pt-6 pb-4 z-20 shadow-sm">
                    <div className="flex flex-col items-center">
                        <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">
                            {categoryName ? normalize(categoryName) : 'Shop'}
                        </p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-gray-900 tracking-tight text-center">
                            {effectiveCategory || 'All Products'}
                        </h1>
                        <div className="w-20 h-1 mt-3 bg-gradient-to-r from-[#7A2A2A] to-[#C89D4B] rounded-full"></div>
                    </div>
                </div>

                <div className="flex gap-8 relative">
                    {/* Desktop Sidebar Filters - Sticky and elevated */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-[140px] bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide z-10 transition-shadow">
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        
                        {/* Mobile Filter Button & Active Filters (Keep as is) */}
                        <div className="lg:hidden mb-6 space-y-4">
                            <button 
                                onClick={() => setShowMobileFilters(true)}
                                className="flex items-center justify-between gap-2 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 shadow-sm transition-colors"
                            >
                                <span className="font-medium flex items-center gap-2"><FaFilter className="text-amber-700" /> Filters</span>
                                {activeFilterCount > 0 && (
                                    <span className="ml-2 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                                        {activeFilterCount} Active
                                    </span>
                                )}
                            </button>

                            {/* Active Filters Pills */}
                            {activeFilterCount > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {/* Price Filter Pill */}
                                    {selectedPriceRange && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                            {priceRanges.find(r => r.id === selectedPriceRange)?.label}
                                            <button 
                                                onClick={() => setSelectedPriceRange(null)}
                                                className="ml-2 hover:text-amber-900"
                                            >
                                                <FaTimes className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                    {/* Fabric Filter Pills */}
                                    {selectedFabrics.map(fabric => (
                                        <span key={fabric} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            {fabric}
                                            <button 
                                                onClick={() => toggleFabric(fabric)}
                                                className="ml-2 hover:text-red-900"
                                            >
                                                <FaTimes className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Results Bar (Combined Count & Sort) (Keep as is) */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <p className="text-base text-gray-700">
                                Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> of {products.length} Products
                            </p>
                            <div className="flex items-center gap-3">
                                <label htmlFor="sort" className="text-sm font-medium text-gray-600 whitespace-nowrap">Sort by:</label>
                                <select 
                                    id="sort" 
                                    className="text-sm border-gray-300 rounded-lg focus:ring-amber-700 focus:border-amber-700 shadow-sm"
                                    onChange={(e) => {
                                        const sorted = [...filteredProducts];
                                        switch(e.target.value) {
                                            case 'price-low-high':
                                                sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
                                                break;
                                            case 'price-high-low':
                                                sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
                                                break;
                                            case 'newest':
                                                sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                                                break;
                                            default:
                                                break;
                                        }
                                        setFilteredProducts(sorted);
                                    }}
                                >
                                    <option value="featured">Featured</option>
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="price-low-high">Price: Low to High</option>
                                    <option value="price-high-low">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Product Grid */}
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-200">
                                <p className="text-gray-500 text-xl font-serif italic mb-4">No treasures found matching your selections.</p>
                                <button
                                    onClick={resetFilters}
                                    className="mt-4 text-amber-700 hover:text-amber-800 font-medium text-base transition-colors underline underline-offset-4"
                                >
                                    Clear all filters to see more
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {filteredProducts.map((p) => (
                                    <div
                                        key={p._id || p.title}
                                        className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100 hover:border-amber-100 transform hover:-translate-y-1"
                                        onClick={() => handleCardClick(p)}
                                    >
                                        <div className="relative w-full aspect-[3/4] bg-gray-50">
                                            <img
                                                src={p.images?.image1 || 'https://via.placeholder.com/300x400?text=Image+Not+Available'}
                                                alt={p.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => {e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x400?text=Image+Not+Available';}}
                                            />
                                            
                                            {/* Quick Actions Overlay (Keep as is) */}
                                            <div className="absolute inset-0 bg-black/10 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="p-3 flex justify-end gap-2">
                                                    <button 
                                                        onClick={(e) => {e.stopPropagation(); alert('Added to Wishlist!');}} 
                                                        className="p-2 bg-white/90 text-gray-800 rounded-full hover:bg-white transition-colors transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duration-300 delay-100"
                                                    >
                                                        <FaHeart className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => {e.stopPropagation(); alert('Quick View!');}}
                                                        className="p-2 bg-white/90 text-gray-800 rounded-full hover:bg-white transition-colors transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duration-300 delay-200"
                                                    >
                                                        <IoEyeOutline className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Discount Badge - UPDATED COLOR */}
                                            {(p.discountPercent > 0 || p.discount) && (
                                                <span className="absolute top-3 left-3 **bg-green-700 text-white** text-[11px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-md">
                                                    {p.discountPercent || p.discount}% OFF
                                                </span>
                                            )}
                                        </div>

                                        <div className="relative p-4 sm:p-5">
                                            {/* Decorative Underline on Hover (Keep as is) */}
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7A2A2A] to-[#C89D4B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10"></div>
                                            
                                            <h3 className="text-sm font-medium text-gray-500 line-clamp-1 mb-1">
                                                {p.product_info?.manufacturer || 'Artisan Weaves'}
                                            </h3>
                                            <p className="text-base font-bold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">{p.title || 'Untitled Product'}</p>
                                        
                                            <div className="flex items-baseline gap-2 mt-2">
                                                <div className="flex items-center text-gray-900">
                                                    <FaRupeeSign className="h-3.5 w-3.5" />
                                                    <span className="text-xl font-extrabold ml-0.5">
                                                        {p.price?.toLocaleString() || Math.round(p.mrp - p.mrp * ((p.discountPercent || 0) / 100)).toLocaleString()}
                                                    </span>
                                                </div>
                                                {p.mrp && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        ₹{p.mrp.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Modal (Keep as is) */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black bg-opacity-60" onClick={() => setShowMobileFilters(false)}></div>
                    <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-out">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                            <h3 className="text-xl font-serif italic text-gray-900">Filters</h3>
                            <button 
                                onClick={() => setShowMobileFilters(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <FilterContent />
                        </div>
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 shadow-2xl">
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="w-full px-6 py-3 bg-gradient-to-r from-[#7A2A2A] to-[#C89D4B] text-white font-medium rounded-lg text-lg hover:opacity-90 transition-opacity shadow-lg"
                            >
                                Show {filteredProducts.length} Products
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;