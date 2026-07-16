import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import ProductCard from '../components/productCard';
import { getProducts } from '../services';

interface ProductType {
  _id?: string;
  id?: number;
  title: string;
  price: number;
  mainImage: string;
  discount?: number;
  category?: string;
  isFeatured?: boolean;
  moreImages?: string[];
  rating?: number;
  pieces?: string;  // ✅ ADDED
}

const Collection: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [bestSellers, setBestSellers] = useState<ProductType[]>([]);
  const [regularProducts, setRegularProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPieces, setSelectedPieces] = useState('all');  // ✅ NEW
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        
        const sortedByRating = [...data].sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
        const bestSellersData = sortedByRating.slice(0, 6);
        const regularData = [...data];
        
        setBestSellers(bestSellersData);
        setRegularProducts(regularData);
        setFilteredProducts(regularData);
        
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Filter, Search, Sort Logic
  useEffect(() => {
    let result = [...regularProducts];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(term) || 
        p.category?.toLowerCase().includes(term)
      );
    }

    // Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // ✅ Pieces Filter
    if (selectedPieces !== 'all') {
      result = result.filter(p => p.pieces === selectedPieces);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => (a._id || '').localeCompare(b._id || ''));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [regularProducts, searchTerm, selectedCategory, selectedPieces, sortBy]);

  const categories = ['all', ...new Set(products.map(p => p.category || 'Uncategorized'))];
  
  // ✅ Get unique pieces
  const piecesOptions = ['all', ...new Set(products.map(p => p.pieces).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-[80px] bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#B76E79] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading collections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center py-[80px] bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-[#B76E79] text-white px-6 py-2 rounded-xl hover:bg-[#B76E79]/90 transition transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-[80px]">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* ✅ Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            <span className="bg-gradient-to-r from-[#B76E79] to-pink-500 bg-clip-text text-transparent">
              Our Collection
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Discover timeless elegance with our curated collection of premium women's fashion
          </p>
        </div>

        {/* ✅ BEST SELLERS SECTION */}
        {bestSellers.length > 0 && (
          <div className="mb-12 max-w-[1000px] mx-auto">      
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {bestSellers.map((item) => (
                <div key={item._id || item.id} className="flex flex-col items-center text-center group">
                  <div className="relative">
                    <div 
                      className="w-30 h-30 sm:w-30 sm:h-30 rounded-full overflow-hidden border-4 border-[#B76E79]/20 shadow-lg hover:shadow-xl transition-all cursor-pointer group-hover:scale-105 duration-300"
                      onClick={() => window.location.href = `/product-detail/${item._id || item.id}`}
                    >
                      <img
                        src={item.mainImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <h3 className="mt-1 font-medium text-gray-800 text-sm sm:text-base line-clamp-2 max-w-[140px]">
                    {item.title}
                  </h3>
                  <p className="text-[#B76E79] font-bold text-sm">
                    Rs. {item.price}
                  </p>
                  {item.discount && item.discount > 0 && (
                    <span className="text-xs text-green-600 font-medium">
                      {item.discount}% OFF
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ FILTER BAR */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
            </div>

            {/* ✅ Pieces Filter */}
            <div className="relative">
              <select
                value={selectedPieces}
                onChange={(e) => setSelectedPieces(e.target.value)}
                className="px-4 py-2.5 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition appearance-none cursor-pointer"
              >
                {piecesOptions.map(piece => (
                  <option key={piece} value={piece}>
                    {piece === 'all' ? 'All Pieces' : piece}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition appearance-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Top Rated</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedCategory !== 'all' || selectedPieces !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedPieces('all');
                }}
                className="text-sm text-[#B76E79] hover:underline cursor-pointer whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* ✅ ALL PRODUCTS */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-400 text-lg">No products found matching your criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedPieces('all');
                }}
                className="mt-4 text-[#B76E79] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6 max-w-[1100px] mx-auto">
              {filteredProducts.map((item) => (
                <ProductCard
                  key={item._id || item.id}
                  id={item._id || item.id}
                  Image={item.mainImage}
                  price={item.price}
                  title={item.title}
                  HoverImg={item.moreImages}
                  discount={item.discount}
                  DiscountPrice={Math.round((item.price) - (item.price * (item.discount || 0) / 100))}
                  rating={item.rating || 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;