import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from '../components/productCard';
import { getProducts } from '../services';
import { LuSearch, LuSlidersHorizontal, LuSparkles } from 'react-icons/lu';

// ✅ Swiper CSS import
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

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
  pieces?: string;
}

// ---------------------------------------------------------------------------
// NOTE ON FONTS
// This design pairs a serif display face with a clean sans body face.
// Add these once to your root document (e.g. index.html <head> or _document.tsx):
//
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
//
// Then Tailwind arbitrary classes like font-['Playfair_Display'] below will render correctly.
// ---------------------------------------------------------------------------

const Collection: React.FC = () => {

  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [bestSellers, setBestSellers] = useState<ProductType[]>([]);
  const [regularProducts, setRegularProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPieces, setSelectedPieces] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);

        const sortedByRating = [...data].sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
        const bestSellersData = sortedByRating.slice(0, 10);
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

  useEffect(() => {
    let result = [...regularProducts];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(term) || p.category?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedPieces !== 'all') {
      result = result.filter((p) => p.pieces === selectedPieces);
    }

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

  const categories = ['all', ...new Set(products.map((p) => p.category || 'Uncategorized'))];
  const piecesOptions = ['all', ...new Set(products.map((p) => p.pieces).filter(Boolean))];

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedPieces !== 'all';
  const activeFilterCount = [searchTerm, selectedCategory !== 'all', selectedPieces !== 'all'].filter(Boolean).length;

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPieces('all');
  };

  // ---------------------------------------------------------------------
  // LOADING STATE — skeleton grid instead of a bare spinner
  // ---------------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF7F5] py-[80px]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col items-center mb-10">
            <div className="h-3 w-28 bg-[#EFE0DD] rounded-full animate-pulse mb-4" />
            <div className="h-10 w-72 bg-[#EFE0DD] rounded-lg animate-pulse mb-3" />
            <div className="h-4 w-96 max-w-full bg-[#EFE0DD] rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 max-w-[1100px] mx-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-[3/4] bg-[#EFE0DD] rounded-2xl mb-3" />
                <div className="h-3 w-3/4 bg-[#EFE0DD] rounded mb-2" />
                <div className="h-3 w-1/3 bg-[#EFE0DD] rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center py-[80px] bg-[#FBF7F5]">
        <div className="text-center px-6">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-[#8B4A56] text-lg font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-[#B76E79] text-white px-8 py-3 rounded-full font-medium tracking-wide hover:bg-[#8B4A56] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#B76E79]/20"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF7F5] py-[80px] ">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.5s ease both; }
        @keyframes underlineGrow {
          from { width: 0; }
          to { width: 64px; }
        }
        .underline-grow { animation: underlineGrow 0.8s 0.2s ease both; }
        .collection-page .swiper-pagination-bullet {
          background: #B76E79;
          opacity: 0.3;
        }
        .collection-page .swiper-pagination-bullet-active {
          opacity: 1;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes panelDown {
          from { opacity: 0; transform: translateY(-6px); max-height: 0; }
          to { opacity: 1; transform: translateY(0); max-height: 300px; }
        }
        .panel-down { animation: panelDown 0.25s ease both; overflow: hidden; }
      `}</style>

      <div className="mx-auto">
        {/* ================= HERO ================= */}
        <div ref={ref} className="flex flex-col justify-center gap-2 md:gap-0 mb-4 fade-in-up overflow-hidden relative h-[230px]">

         
        <div className='h-full w-[300px] absolute -translate-x-1/2 left-[71%]'>
          <img src="images/girl.png" 
               className={`absolute  h-[135%] -top-2 left-[-17.6%] delay-900 ${isVisible ? "animate-fade-in-left" : "opacity-0"}`}/>

          <img src="images/man.png" 
                className={`absolute h-[135%] -top-2 right-[-17.6%] delay-900 ${isVisible ? "animate-fade-in-right" : "opacity-0"}`}/>
         </div>
            

           <img src="images/just2.png" 
                className='absolute -z-20 w-full -translate-y-1/2 top-1/2 scale-x-[-1]'/>

          <div className='absolute w-full h-full -z-10 backdrop-blur-[2px] bg-white/6'></div>  

          <div className='absolute w-full h-full -z-1  bg-gradient-to-tl from-[#ffffff29] to-[#ffff]'></div>
  
          <div className={`inline-flex items-center lg:ml-[20%] ml-[8px] gap-2 text-[11px] tracking-[0.3em] uppercase text-[#B76E79] font-semibold md:mb-4 delay-200 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <LuSparkles className="text-sm" />
            Curated For You
          </div>
          <h1 className={`font-['Playfair_Display'] lg:ml-[20%] ml-[8px] text-3xl sm:text-5xl md:text-6xl font-semibold text-[#2A2422] md:mb-4 leading-tight delay-400 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            Our{' '}
            <span className="italic bg-gradient-to-r from-[#B76E79] to-[#8B4A56] bg-clip-text text-transparent">
              Collection
            </span>
          </h1>
          <div className="h-[3px] bg-gradient-to-r lg:ml-[20%] ml-[8px] from-[#B76E79] to-[#C9A24B] rounded-full md:mb-5 underline-grow" />
          <p className={`text-[#6b5d63] text-left lg:ml-[20%] ml-[8px] text-sm w-[50%]  sm:w-[60%]  md:w-[40%] sm:text-lg max-w-xl font-['Inter'] delay-600 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            Discover timeless elegance with our curated collection of premium women's fashion
          </p>
        </div>

        {/* ================= FILTER BAR — DESKTOP (unchanged) ================= */}
        <div className="hidden md:block sticky top-[65px] z-[999] mb-12">
          <div className="bg-black/30 backdrop-blur-sm shadow-sm shadow-[#B76E79]/5 pt-4 px-10">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[220px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-[#FBF7F5] border border-[#EFE0DD] rounded-xl focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/10 transition-all font-['Inter'] text-sm"
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B76E79]/60">
                    <LuSearch />
                  </span>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B76E79] cursor-pointer transition-colors"
                      aria-label="Clear search"
                    >
                      <FaTimes size={13} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#B76E79] pl-1 pr-2">
                <LuSlidersHorizontal size={16} />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 bg-[#FBF7F5] border border-[#EFE0DD] rounded-xl focus:outline-none focus:border-[#B76E79] transition-all appearance-none cursor-pointer text-sm font-['Inter'] text-[#2A2422]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedPieces}
                onChange={(e) => setSelectedPieces(e.target.value)}
                className="px-4 py-2.5 bg-[#FBF7F5] border border-[#EFE0DD] rounded-xl focus:outline-none focus:border-[#B76E79] transition-all appearance-none cursor-pointer text-sm font-['Inter'] text-[#2A2422]"
              >
                {piecesOptions.map((piece) => (
                  <option key={piece} value={piece}>
                    {piece === 'all' ? 'All Pieces' : piece}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 bg-[#FBF7F5] border border-[#EFE0DD] rounded-xl focus:outline-none focus:border-[#B76E79] transition-all appearance-none cursor-pointer text-sm font-['Inter'] text-[#2A2422]"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Top Rated</option>
              </select>
            </div>

            {/* Active filter chips + result count */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#F3E4E1]">

              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-[#F3E4E1] text-[#8B4A56] px-3 py-1 rounded-full font-['Inter']">
                  "{searchTerm}"
                  <FaTimes size={9} className="cursor-pointer" onClick={() => setSearchTerm('')} />
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-[#F3E4E1] text-[#8B4A56] px-3 py-1 rounded-full font-['Inter']">
                  {selectedCategory}
                  <FaTimes size={9} className="cursor-pointer" onClick={() => setSelectedCategory('all')} />
                </span>
              )}
              {selectedPieces !== 'all' && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-[#F3E4E1] text-[#8B4A56] px-3 py-1 rounded-full font-['Inter']">
                  {selectedPieces}
                  <FaTimes size={9} className="cursor-pointer" onClick={() => setSelectedPieces('all')} />
                </span>
              )}

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-auto text-xs text-[#B76E79] hover:text-[#8B4A56] hover:underline cursor-pointer font-medium font-['Inter']"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ================= FILTER BAR — MOBILE (compact, collapsible) ================= */}
        <div className="md:hidden sticky top-2 z-[999] mb-8 px-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#EFE0DD] shadow-md shadow-[#B76E79]/10 p-2.5">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-[#FBF7F5] border border-[#EFE0DD] rounded-xl focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/10 transition-all font-['Inter'] text-sm"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B76E79]/60 text-sm">
                  <LuSearch />
                </span>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 active:text-[#B76E79] cursor-pointer"
                    aria-label="Clear search"
                  >
                    <FaTimes size={11} />
                  </button>
                )}
              </div>

              <button
                onClick={() => setMobileFiltersOpen((v) => !v)}
                aria-label="Toggle filters"
                className={`relative shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center transition-colors ${
                  mobileFiltersOpen
                    ? 'bg-[#B76E79] border-[#B76E79] text-white'
                    : 'bg-[#FBF7F5] border-[#EFE0DD] text-[#B76E79]'
                }`}
              >
                <LuSlidersHorizontal size={17} />
                {activeFilterCount > 0 && !mobileFiltersOpen && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-[3px] rounded-full bg-[#8B4A56] text-white text-[9px] font-bold flex items-center justify-center font-['Inter']">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {mobileFiltersOpen && (
              <div className="panel-down mt-2.5 pt-2.5 border-t border-[#F3E4E1] flex flex-col gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBF7F5] border border-[#EFE0DD] rounded-xl focus:outline-none focus:border-[#B76E79] appearance-none cursor-pointer text-sm font-['Inter'] text-[#2A2422]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedPieces}
                  onChange={(e) => setSelectedPieces(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBF7F5] border border-[#EFE0DD] rounded-xl focus:outline-none focus:border-[#B76E79] appearance-none cursor-pointer text-sm font-['Inter'] text-[#2A2422]"
                >
                  {piecesOptions.map((piece) => (
                    <option key={piece} value={piece}>
                      {piece === 'all' ? 'All Pieces' : piece}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FBF7F5] border border-[#EFE0DD] rounded-xl focus:outline-none focus:border-[#B76E79] appearance-none cursor-pointer text-sm font-['Inter'] text-[#2A2422]"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Top Rated</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-[#B76E79] active:text-[#8B4A56] cursor-pointer font-medium font-['Inter'] self-start mt-1"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Active filter chips — horizontal scroll so they never wrap/expand the bar */}
            {hasActiveFilters && !mobileFiltersOpen && (
              <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-[#F3E4E1] overflow-x-auto no-scrollbar">
                {searchTerm && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] bg-[#F3E4E1] text-[#8B4A56] px-2.5 py-1 rounded-full font-['Inter']">
                    "{searchTerm}"
                    <FaTimes size={8} className="cursor-pointer" onClick={() => setSearchTerm('')} />
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] bg-[#F3E4E1] text-[#8B4A56] px-2.5 py-1 rounded-full font-['Inter']">
                    {selectedCategory}
                    <FaTimes size={8} className="cursor-pointer" onClick={() => setSelectedCategory('all')} />
                  </span>
                )}
                {selectedPieces !== 'all' && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] bg-[#F3E4E1] text-[#8B4A56] px-2.5 py-1 rounded-full font-['Inter']">
                    {selectedPieces}
                    <FaTimes size={8} className="cursor-pointer" onClick={() => setSelectedPieces('all')} />
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ================= CUSTOMER FAVORITES (ranked) ================= */}
        {bestSellers.length > 0 && (
          <div className="mb-16 max-w-[1000px] mx-auto relative">

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={4}
              slidesPerView={2}
              pagination={{ clickable: true }}
              loop={true}
              autoplay={{ delay: 4000, disableOnInteraction: true }}
              breakpoints={{
                480: { slidesPerView: 3, spaceBetween: 15 },
                640: { slidesPerView: 4, spaceBetween: 20 },
                768: { slidesPerView: 4, spaceBetween: 20 },
                1024: { slidesPerView: 6, spaceBetween: 25 },
                1280: { slidesPerView: 6, spaceBetween: 25 },
              }}
              className="best-seller-slider collection-page"
              style={{ paddingBottom: '40px' }}
            >
              {bestSellers.map((item, index) => (
                <SwiperSlide key={item._id || item.id}>
                  <div className="flex flex-col items-center text-center group relative">
                    <div className="relative">
                      <div
                        className="w-34 h-34 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-[3px] border-white shadow-[0_0_0_2px_#B76E79] shadow-lg hover:shadow-xl transition-all cursor-pointer group-hover:scale-105 duration-300 mx-auto"
                        onClick={() => (window.location.href = `/product-detail/${item._id || item.id}`)}
                      >
                        <img
                          src={item.mainImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <span className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-[#B76E79] text-white text-[10px] font-bold flex items-center justify-center shadow-md font-['Inter']">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="mt-2.5 font-medium text-gray-800 text-xs sm:text-sm line-clamp-1 max-w-[80px] sm:max-w-[100px] font-['Inter']">
                      {item.title}
                    </h3>
                    <p className="text-[#B76E79] font-bold text-xs sm:text-sm font-['Inter']">
                      Rs. {item.price}
                    </p>
                    {item.discount && item.discount > 0 && (
                      <span className="text-[10px] text-green-600 font-medium">{item.discount}% OFF</span>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* ================= ALL PRODUCTS ================= */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-[#EFE0DD]">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-[#6B615D] text-lg font-['Inter'] mb-1">No products found</p>
              <p className="text-[#9A908C] text-sm font-['Inter'] mb-5">
                Try adjusting your search or filters
              </p>
              <button
                onClick={clearFilters}
                className="text-[#B76E79] hover:underline cursor-pointer font-medium font-['Inter']"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6 max-w-[1100px] mx-auto">
              {filteredProducts.map((item, index) => (
                <div
                  key={item._id || item.id}
                  className="fade-in-up"
                  style={{ animationDelay: `${Math.min(index, 8) * 0.05}s` }}
                >
                  <ProductCard
                    id={item._id || item.id}
                    Image={item.mainImage}
                    price={item.price}
                    title={item.title}
                    HoverImg={item.moreImages}
                    discount={item.discount}
                    DiscountPrice={Math.round(item.price - (item.price * (item.discount || 0)) / 100)}
                    rating={item.rating || 0}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
