import { useState } from "react";
import Home from "./pages/home/home"
import MobileMenu from "./components/mobileMenu"
import Navbar from "./components/navbar"
import ProductDetail from "./pages/productDetails/productDetail"
import Footer from "./components/footer";
import { BrowserRouter, Routes , Route } from "react-router-dom";
import ScrollToTop from "./components/scrollToTop";
import CartPage from "./pages/Cart/Cart"
import { CartProvider, useCart } from "./pages/context/cartContext";
import { useWishlist, WishlistProvider } from './pages/context/wishlistContext';
import AddToCartAnimation from "./components/addToCartAnimation";
import LikeProduct from "./pages/Liked/likeProduct";
import AddToWishlistAnimation from "./components/addToWishlistAnimation";
import LoginModal from "./Auth/loginModal";
import SignupModal from "./Auth/signupModal";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import CheckoutPage from "./pages/CheckoutPage";
import { AuthProvider } from "./Auth/authContext";
import UserProfilePage from "./pages/UserProfile/UserProfilePage";
import Collection from "./pages/Collection";
import AboutPage from "./pages/About";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLogin from "./pages/Admin/AdminLogin";
import { AdminProvider } from "./pages/context/AdminContext";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminAddProduct from "./pages/Admin/AdminAddProduct";
import AdminEditProduct from "./pages/Admin/AdminEditProduct";
// ✅ ProductProvider IMPORT KARO
import { ProductProvider } from "./pages/context/ProductContext";
import NotFoundPage from "./pages/NotFoundPage";
import NotificationDetail from "./pages/Admin/NotificationDetail";
import NotificationHistory from "./pages/Admin/NotificationHistory";
import AdminSubscribers from "./pages/Admin/AdminSubscribers";
import Unsubscribe from "./pages/Unsubscribe";

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAnimating } = useCart(); 
  const { isAnimatingwishlist } = useWishlist();
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignUpModal, setOpenSignUpModal] = useState(false);

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar setIsMenuOpen={setIsMenuOpen} isOpenLogiModal={setOpenLoginModal} />
        <LoginModal  hideLoginModal={setOpenLoginModal} isOpenLoginModal={openLoginModal} showSignUpModal={setOpenSignUpModal}/>
        <SignupModal hideSignUpModal={setOpenSignUpModal} isOpenSignUPModal={openSignUpModal} showLoginModal={setOpenLoginModal}  />
        <AddToCartAnimation runAnimation={isAnimating} />
        <AddToWishlistAnimation runAnination={isAnimatingwishlist}/>
        <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfilePage />} /> 
          <Route path="/about" element={<AboutPage />} />
          <Route path="/product-detail/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favurite-product" element={<LikeProduct />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/1st-admin/a-y-w/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />
          <Route path="/admin/products/add" element={
            <AdminRoute>
              <AdminAddProduct />
            </AdminRoute>
          } />
          <Route path="/admin/products/edit/:id" element={
            <AdminRoute>
              <AdminEditProduct />
            </AdminRoute> 
          } />
          <Route path="/admin/notifications/:id" element={
          <AdminRoute>
            <NotificationDetail />
          </AdminRoute>
        } />
        <Route path="/admin/notifications/history" element={
          <AdminRoute>
            <NotificationHistory />
          </AdminRoute>
        } />
         <Route path="/admin/subscribers" element={
          <AdminRoute>
            <AdminSubscribers />
          </AdminRoute>
         } />

         <Route path="/unsubscribe" element={<Unsubscribe />} />
        
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer /> 
      </BrowserRouter>
    </>
  );
}

function App() {
  return (
    <AdminProvider> 
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <ProductProvider>
              <AppContent />
            </ProductProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </AdminProvider>
  );
}

export default App;