import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaStar, 
  FaRegStar,
  FaEye
} from 'react-icons/fa';


const AdminProducts:React.FC = () => {
  const { products, deleteProduct, toggleFeatured, updateStock, searchProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = searchProducts(searchQuery);
  
  const categories = ['all', ...new Set(products.map(p => p.category))];

  const finalProducts = selectedCategory === 'all' 
    ? filteredProducts 
    : filteredProducts.filter(p => p.category === selectedCategory);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleStockUpdate = (id: number, currentStock: number) => {
    const newStock = prompt('Enter new stock quantity:', String(currentStock));
    if (newStock !== null && !isNaN(Number(newStock))) {
      updateStock(id, Number(newStock));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[65px] max-w-[1150px] mx-auto">
      <div className="container mx-auto px-4 max-w-7xl py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
            <p className="text-gray-500">Manage your product catalog</p>
          </div>
          <Link 
            to="/admin/products/add"
            className="flex items-center gap-2 bg-[#B76E79] text-white px-4 py-2 rounded-xl hover:bg-[#B76E79]/90 transition cursor-pointer"
          >
            <FaPlus />
            Add New Product
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Featured</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {finalProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.mainImage} 
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{product.title}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">
                            {product.details}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#B76E79]">
                      Rs. {product.price}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {product.stock}
                        </span>
                        <button
                          onClick={() => handleStockUpdate(product.id, product.stock)}
                          className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded cursor-pointer"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFeatured(product.id)}
                        className="text-xl cursor-pointer hover:scale-110 transition"
                      >
                        {product.isFeatured ? (
                          <FaStar className="text-yellow-400" />
                        ) : (
                          <FaRegStar className="text-gray-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/admin/products/edit/${product.id}`}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition cursor-pointer"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition cursor-pointer"
                        >
                          <FaTrash />
                        </button>
                        <Link 
                          to={`/product-detail/${product.id}`}
                          target="_blank"
                          className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                        >
                          <FaEye />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {finalProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;