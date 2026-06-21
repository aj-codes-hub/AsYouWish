import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { Product } from '../data/productCard/product';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const filtered = Product.filter((product) => {
        const searchLower = searchTerm.toLowerCase().trim();
        return (
          product.title.toLowerCase().includes(searchLower) ||
          product.details?.toLowerCase().includes(searchLower) ||
          product.Event?.toLowerCase().includes(searchLower) ||
          product.price.toString().includes(searchLower)
        );
      });
      setSearchResults(filtered);
      setIsLoading(false);
    }, 300); // Debounce for better performance

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle product click
  const handleProductClick = (productId: number) => {
    navigate(`/product-detail/${productId}`);
    onClose();
    setSearchTerm('');
    setSearchResults([]);
  };

  // Handle close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        setSearchTerm('');
        setSearchResults([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]  animate-fadeIn">
       
       <div onClick={() => {
              onClose();
              setSearchTerm('');
              setSearchResults([]);
            }} className='absolute h-full w-full bg-black/20 z-[10]'>
       </div>

      <div className="bg-white w-full max-w-2xl absolute sm:top-1/2 left-1/2 -translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl shadow-2xl overflow-hidden animate-slideDown z-[20]">
        
        {/* Search Header */}
        <div className="flex items-center border-b border-gray-100 px-4 py-3">
          <FiSearch className="text-gray-400 text-xl" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for products..."
            className="w-full px-4 py-2 text-lg outline-none bg-transparent text-gray-800 placeholder-gray-400"
            autoFocus
          />
          <button
            onClick={() => {
              onClose();
              setSearchTerm('');
              setSearchResults([]);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
          >
            <FiX className="text-gray-500 text-xl" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {searchTerm.trim() === '' ? (
            <div className="text-center py-12 text-gray-400">
              <FiSearch className="text-5xl mx-auto mb-4 opacity-30" />
              <p>Type something to start searching</p>
              <p className="text-sm mt-1">Search by product name, category, or price</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-[#B76E79] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="text-gray-400 text-sm mt-1">Try searching with different keywords</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-400 mb-4">
                Found {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'}
              </p>
              <div className="space-y-3">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="flex items-center gap-4 p-3 hover:bg-[#B76E79]/5 rounded-xl cursor-pointer transition-all hover:scale-[1.02] group"
                  >
                    <img
                      src={product.mainImage}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-lg shadow-sm group-hover:shadow-md transition"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {product.title}
                      </h4>
                      {product.details && (
                        <p className="text-sm text-gray-500 truncate">
                          {product.details}
                        </p>
                      )}
                      {product.Event && (
                        <span className="text-xs text-[#B76E79] font-medium">
                          {product.Event}
                        </span>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-[#B76E79]">Rs. {product.price}</p>
                      {product.discount && product.discount > 0 && (
                        <span className="text-xs text-green-600 font-medium">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Quick suggestions */}
        {searchTerm.trim() === '' && (
          <div className="border-t border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-400 mb-2">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {['Abaya', 'Dress', 'Kurta', 'Collection', 'New Arrival'].map((item) => (
                <button
                  key={item}
                  onClick={() => setSearchTerm(item)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-[#B76E79]/10 rounded-full text-gray-600 hover:text-[#B76E79] transition cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
        

        <div className="border-t border-gray-100 px-4 py-6">
            <p className="text-xs text-gray-400 mb-2">Menu Options</p>
            <div className="flex flex-wrap gap-2">
                <button onClick={()=> { navigate('/'); onClose();}} className="px-3 py-1 text-xs bg-gray-100 hover:bg-[#B76E79]/10 rounded-full text-gray-600 hover:text-[#B76E79] transition cursor-pointer">
                  About us
                </button>

                 <button onClick={()=> { navigate('/'); onClose();}} className="px-3 py-1 text-xs bg-gray-100 hover:bg-[#B76E79]/10 rounded-full text-gray-600 hover:text-[#B76E79] transition cursor-pointer">
                  Collections
                </button>

                 <button onClick={()=> { navigate('/'); onClose();}} className="px-3 py-1 text-xs bg-gray-100 hover:bg-[#B76E79]/10 rounded-full text-gray-600 hover:text-[#B76E79] transition cursor-pointer">
                  Shop
                </button>

                 <button onClick={()=> { navigate('/'); onClose();}} className="px-3 py-1 text-xs bg-gray-100 hover:bg-[#B76E79]/10 rounded-full text-gray-600 hover:text-[#B76E79] transition cursor-pointer">
                  Home
                </button>
            </div>
          </div>

      </div>
    </div>
  );
};

export default SearchModal;