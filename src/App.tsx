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
          <Route path="/product-detail/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favurite-product" element={<LikeProduct />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
    <WishlistProvider>
    <CartProvider>
      <AppContent />
    </CartProvider>
    </WishlistProvider>
    </AuthProvider>
  );
}

export default App;