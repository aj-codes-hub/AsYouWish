import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaTimes, FaImage } from 'react-icons/fa';
import { useProducts } from '../context/ProductContext';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const [isLoading, setIsLoading] = useState(false);
  
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const moreImageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    discount: '0',
    details: '',
    mainImage: '',
    moreImages: ['', '', ''],
    category: '',
    stock: '10',
    isFeatured: false,
    fabricType: '',
    productType: '',
    designType: '',
    pieces: '',
    color: '',
    size: '',
  });

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({
            ...prev,
            mainImage: event.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ FIXED: Multiple images upload
  const handleMoreImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert FileList to array
    const fileArray = Array.from(files);
    
    // Filter only image files
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));

    // Create a copy of current moreImages
    let updatedMoreImages = [...formData.moreImages];


    // Loop through each image file
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          // Find first empty slot
          const emptyIndex = updatedMoreImages.findIndex(img => img === '');
          
          if (emptyIndex !== -1) {
            updatedMoreImages[emptyIndex] = event.target?.result as string;
          } else {
            // Agar sab slots fill hain to add karo (max 3 ke liye check)
            if (updatedMoreImages.length < 3) {
              updatedMoreImages.push(event.target?.result as string);
            }
          }
          
          // Update state with latest changes
          setFormData(prev => ({
            ...prev,
            moreImages: updatedMoreImages,
          }));
        }
      };
      
      reader.readAsDataURL(file);
    });
  };


  const removeMoreImage = (index: number) => {
    const newImages = [...formData.moreImages];
    newImages[index] = '';
    setFormData(prev => ({
      ...prev,
      moreImages: newImages,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const productData = {
      title: formData.title,
      price: Number(formData.price),
      discount: Number(formData.discount),
      details: formData.details,
      mainImage: formData.mainImage || 'https://via.placeholder.com/400x500?text=Product',
      moreImages: formData.moreImages.filter(img => img.trim() !== ''),
      category: formData.category || 'Uncategorized',
      stock: Number(formData.stock),
      isFeatured: formData.isFeatured,
      Event: formData.category || 'Uncategorized',
      Rating: 0,
      review: [],
      fabricType: formData.fabricType,
      productType: formData.productType,
      designType: formData.designType,
      pieces: formData.pieces,
      color: formData.color,
      size: formData.size,
    };

    setTimeout(() => {
      addProduct(productData);
      setIsLoading(false);
      navigate('/admin/products');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[65px]">
      <div className="container mx-auto px-4 max-w-4xl py-8">
        
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#B76E79] transition mb-6 cursor-pointer"
        >
          <FaArrowLeft />
          Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ===== BASIC INFO ===== */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition"
                  placeholder="Enter product title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (Rs.) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition"
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition"
                  placeholder="e.g., Abaya, Dress, Kurta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition"
                  placeholder="10"
                />
              </div>
            </div>

            {/* ===== PRODUCT SPECIFICATIONS ===== */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Specifications</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fabric Type
                  </label>
                  <select
                    name="fabricType"
                    value={formData.fabricType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition"
                  >
                    <option value="">Select Fabric</option>
                    <option value="Lawn">Lawn</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Silk">Silk</option>
                    <option value="Chiffon">Chiffon</option>
                    <option value="Georgette">Georgette</option>
                    <option value="Velvet">Velvet</option>
                    <option value="Linen">Linen</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Type
                  </label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition"
                  >
                    <option value="">Select Type</option>
                    <option value="Stitched">Stitched</option>
                    <option value="Unstitched">Unstitched</option>
                    <option value="Semi-Stitched">Semi-Stitched</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Design Type
                  </label>
                  <select
                    name="designType"
                    value={formData.designType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition"
                  >
                    <option value="">Select Design</option>
                    <option value="Printed">Printed</option>
                    <option value="Embroidered">Embroidered</option>
                    <option value="Solid">Solid</option>
                    <option value="Woven">Woven</option>
                    <option value="Dyed">Dyed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pieces
                  </label>
                  <select
                    name="pieces"
                    value={formData.pieces}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition"
                  >
                    <option value="">Select Pieces</option>
                    <option value="1 Piece">1 Piece</option>
                    <option value="2 Piece">2 Piece</option>
                    <option value="3 Piece">3 Piece</option>
                    <option value="4 Piece">4 Piece</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition"
                    placeholder="e.g., Red, Blue, Black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition"
                    placeholder="e.g., S, M, L, XL, Free"
                  />
                </div>
              </div>
            </div>

            {/* ===== IMAGES ===== */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Images</h3>
              
              {/* Main Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image
                </label>
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <input
                      type="file"
                      ref={mainImageInputRef}
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => mainImageInputRef.current?.click()}
                      className="flex items-center gap-2 bg-[#B76E79] text-white px-4 py-2 rounded-xl hover:bg-[#B76E79]/90 transition cursor-pointer"
                    >
                      <FaUpload />
                      Choose Image
                    </button>
                  </div>

                  {formData.mainImage && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200">
                      <img
                        src={formData.mainImage}
                        alt="Main"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, mainImage: '' }))}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 transition"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* More Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  More Images (Max 3)
                </label>
                <div className="flex items-center gap-4 mb-3">
                  <div>
                    <input
                      type="file"
                      ref={moreImageInputRef}
                      accept="image/*"
                      multiple
                      onChange={handleMoreImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => moreImageInputRef.current?.click()}
                      className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition cursor-pointer"
                    >
                      <FaUpload />
                      Select Multiple Images
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">
                    (Hold Ctrl/Cmd to select multiple)
                  </span>
                </div>

                {/* More Images Preview */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {formData.moreImages.map((img, index) => (
                    img ? (
                      <div key={index} className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group">
                        <img
                          src={img}
                          alt={`More ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeMoreImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div key={index} className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                        <FaImage className="text-2xl mb-1" />
                        <span className="text-xs">Empty</span>
                      </div>
                    )
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Upload up to 3 images (PNG, JPG, WebP)
                </p>
              </div>
            </div>

            {/* ===== DESCRIPTION ===== */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Description *
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#B76E79] transition resize-none"
                  placeholder="Describe your product..."
                />
              </div>

              <div className="flex items-center gap-3 mt-4">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[#B76E79]"
                />
                <label className="text-sm font-medium text-gray-700">
                  Featured Product
                </label>
              </div>
            </div>

            {/* ===== SUBMIT BUTTONS ===== */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#B76E79] text-white py-3 rounded-xl font-semibold hover:bg-[#B76E79]/90 transition disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Adding Product...' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;