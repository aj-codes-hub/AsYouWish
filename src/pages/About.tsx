import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaRegHeart, 
  FaLeaf, 
  FaQuoteLeft,
  FaCheckCircle,
  FaAward,
  FaUsers,
  FaGlobeAsia
} from 'react-icons/fa';
import { FiHeart, FiStar, FiTruck } from 'react-icons/fi';
import {  TbRefresh, TbShieldCheck } from 'react-icons/tb';

const AboutPage:React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-[65px]">
      
      {/* ===== HERO SECTION ===== */}
      <div className="relative bg-gradient-to-r from-[#B76E79] via-[#c97e89] to-[#B76E79] text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium mb-4">
            About Us
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Empowering Women Through Fashion
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-white/90">
            Discover the story behind AS YOU WISH — where elegance meets comfort, 
            and every piece tells a story of confidence and grace.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* ===== OUR STORY ===== */}
        <div className="py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#B76E79] font-semibold text-sm tracking-wider uppercase">Our Story</span>
              <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-4">
                Where Elegance Meets Comfort
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                AS YOU WISH was born from a simple belief — that every woman deserves 
                to feel beautiful, confident, and comfortable in what she wears. 
                What started as a small passion project has grown into a beloved 
                brand that celebrates the unique style of women everywhere.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our collections are thoughtfully designed to blend traditional 
                craftsmanship with modern aesthetics, creating pieces that are 
                timeless yet contemporary. We believe in fashion that empowers, 
                not just dresses.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 bg-[#B76E79]/10 px-4 py-2 rounded-full">
                  <FaCheckCircle className="text-[#B76E79]" />
                  <span className="text-sm font-medium text-gray-700">100% Original</span>
                </div>
                <div className="flex items-center gap-2 bg-[#B76E79]/10 px-4 py-2 rounded-full">
                  <FaCheckCircle className="text-[#B76E79]" />
                  <span className="text-sm font-medium text-gray-700">Ethical Fashion</span>
                </div>
                <div className="flex items-center gap-2 bg-[#B76E79]/10 px-4 py-2 rounded-full">
                  <FaCheckCircle className="text-[#B76E79]" />
                  <span className="text-sm font-medium text-gray-700">Sustainable</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#B76E79]/20 to-pink-100 rounded-3xl p-8">
                <img 
                  src="/images/about-story.jpg" 
                  alt="Our Story" 
                  className="rounded-2xl shadow-2xl w-full object-cover h-[400px]"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600';
                  }}
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-[#B76E79]">4.9</span>
                    <div>
                      <div className="flex text-yellow-400">
                        <FiStar className="fill-current" />
                        <FiStar className="fill-current" />
                        <FiStar className="fill-current" />
                        <FiStar className="fill-current" />
                        <FiStar className="fill-current" />
                      </div>
                      <span className="text-xs text-gray-500">500+ Reviews</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== STATS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-y border-gray-200">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#B76E79]">5K+</p>
            <p className="text-sm text-gray-500 mt-1">Happy Customers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#B76E79]">200+</p>
            <p className="text-sm text-gray-500 mt-1">Collections</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#B76E79]">50+</p>
            <p className="text-sm text-gray-500 mt-1">Designers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#B76E79]">100%</p>
            <p className="text-sm text-gray-500 mt-1">Customer Satisfaction</p>
          </div>
        </div>

        {/* ===== OUR VALUES ===== */}
        <div className="py-16">
          <div className="text-center mb-12">
            <span className="text-[#B76E79] font-semibold text-sm tracking-wider uppercase">Core Values</span>
            <h2 className="text-3xl font-bold text-gray-800 mt-2">What We Stand For</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Our values guide everything we do — from design to delivery.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition group border border-gray-100">
              <div className="w-14 h-14 bg-[#B76E79]/10 rounded-xl flex items-center justify-center text-[#B76E79] text-2xl group-hover:bg-[#B76E79] group-hover:text-white transition">
                <FaLeaf />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">Sustainable Fashion</h3>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                We're committed to eco-friendly practices and sustainable materials 
                that are kind to both you and the planet.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition group border border-gray-100">
              <div className="w-14 h-14 bg-[#B76E79]/10 rounded-xl flex items-center justify-center text-[#B76E79] text-2xl group-hover:bg-[#B76E79] group-hover:text-white transition">
                <FaRegHeart />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">Ethical Production</h3>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Every piece is crafted with care and respect for the artisans 
                who bring our designs to life.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition group border border-gray-100">
              <div className="w-14 h-14 bg-[#B76E79]/10 rounded-xl flex items-center justify-center text-[#B76E79] text-2xl group-hover:bg-[#B76E79] group-hover:text-white transition">
                <FaUsers />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">Community First</h3>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                We believe in building a community of empowered women who uplift 
                and inspire each other through fashion.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition group border border-gray-100">
              <div className="w-14 h-14 bg-[#B76E79]/10 rounded-xl flex items-center justify-center text-[#B76E79] text-2xl group-hover:bg-[#B76E79] group-hover:text-white transition">
                <FaAward />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">Quality Craftsmanship</h3>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                From stitching to finishing, every detail is perfected to ensure 
                you receive the highest quality.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition group border border-gray-100">
              <div className="w-14 h-14 bg-[#B76E79]/10 rounded-xl flex items-center justify-center text-[#B76E79] text-2xl group-hover:bg-[#B76E79] group-hover:text-white transition">
                <FiHeart />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">Designed for You</h3>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Every collection is designed with the modern woman in mind — 
                celebrating diversity, body positivity, and individual style.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition group border border-gray-100">
              <div className="w-14 h-14 bg-[#B76E79]/10 rounded-xl flex items-center justify-center text-[#B76E79] text-2xl group-hover:bg-[#B76E79] group-hover:text-white transition">
                <FaGlobeAsia />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">Global Inspiration</h3>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Drawing inspiration from cultures around the world to create 
                truly unique and beautiful pieces.
              </p>
            </div>
          </div>
        </div>

        {/* ===== WHY CHOOSE US ===== */}
        <div className="py-16 bg-gradient-to-r from-[#B76E79]/5 to-pink-50 rounded-3xl px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="text-[#B76E79] font-semibold text-sm tracking-wider uppercase">Why Choose Us</span>
            <h2 className="text-3xl font-bold text-gray-800 mt-2">The AS YOU WISH Experience</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#B76E79] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl shadow-lg shadow-[#B76E79]/30">
                <FiTruck />
              </div>
              <h4 className="font-semibold text-gray-800">Free Delivery</h4>
              <p className="text-sm text-gray-500 mt-1">On orders above Rs. 2000</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#B76E79] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl shadow-lg shadow-[#B76E79]/30">
                <TbRefresh />
              </div>
              <h4 className="font-semibold text-gray-800">Easy Returns</h4>
              <p className="text-sm text-gray-500 mt-1">30 days return policy</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#B76E79] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl shadow-lg shadow-[#B76E79]/30">
                <TbShieldCheck />
              </div>
              <h4 className="font-semibold text-gray-800">Secure Payment</h4>
              <p className="text-sm text-gray-500 mt-1">100% secure checkout</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#B76E79] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl shadow-lg shadow-[#B76E79]/30">
                <FaRegHeart />
              </div>
              <h4 className="font-semibold text-gray-800">Premium Quality</h4>
              <p className="text-sm text-gray-500 mt-1">Handpicked fabrics & designs</p>
            </div>
          </div>
        </div>

        {/* ===== TESTIMONIALS ===== */}
        <div className="py-16">
          <div className="text-center mb-12">
            <span className="text-[#B76E79] font-semibold text-sm tracking-wider uppercase">Testimonials</span>
            <h2 className="text-3xl font-bold text-gray-800 mt-2">What Our Customers Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <FaQuoteLeft className="text-[#B76E79] text-2xl mb-4 opacity-50" />
              <p className="text-gray-600 leading-relaxed text-sm">
                "Absolutely love the quality and design! The abaya collection is 
                stunning — perfect for both casual and formal wear. AS YOU WISH 
                has become my go-to brand."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 bg-[#B76E79]/20 rounded-full flex items-center justify-center text-[#B76E79] font-bold">
                  SA
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Sarah Ahmed</p>
                  <p className="text-xs text-gray-400">Lahore, Pakistan</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <FaQuoteLeft className="text-[#B76E79] text-2xl mb-4 opacity-50" />
              <p className="text-gray-600 leading-relaxed text-sm">
                "The attention to detail is incredible! I've received so many 
                compliments on my outfit. The fabric is premium and the fit 
                is just perfect. Highly recommended!"
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 bg-[#B76E79]/20 rounded-full flex items-center justify-center text-[#B76E79] font-bold">
                  FK
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Fatima Khan</p>
                  <p className="text-xs text-gray-400">Karachi, Pakistan</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <FaQuoteLeft className="text-[#B76E79] text-2xl mb-4 opacity-50" />
              <p className="text-gray-600 leading-relaxed text-sm">
                "Finally a brand that understands modern women! The designs are 
                contemporary yet culturally rich. Shipping was fast and 
                packaging was beautiful."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 bg-[#B76E79]/20 rounded-full flex items-center justify-center text-[#B76E79] font-bold">
                  ZH
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Zara Hussain</p>
                  <p className="text-xs text-gray-400">Islamabad, Pakistan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CTA SECTION ===== */}
        <div className="py-16">
          <div className="bg-gradient-to-r from-[#B76E79] to-[#c97e89] rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Perfect Outfit?
            </h2>
            <p className="text-white/90 max-w-xl mx-auto mb-6">
              Explore our collections and discover fashion that truly reflects 
              your unique style and personality.
            </p>
            <Link 
              to="/"
              className="inline-block bg-white text-[#B76E79] px-8 py-3 rounded-full font-semibold hover:bg-[#B76E79]/10 hover:text-white hover:ring-2 hover:ring-white transition"
            >
              Shop Now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;