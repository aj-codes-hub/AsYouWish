import { useState } from "react";
import Home from "./pages/home/home"
import MobileMenu from "./components/mobileMenu"
import Navbar from "./components/navbar"
import ProductDetail from "./pages/productDetails/productDetail"
import Footer from "./components/footer";
import { BrowserRouter, Routes , Route } from "react-router-dom";
import ScrollToTop from "./components/scrollToTop";
import AddToCart from "./pages/addToCart/addToCart";

function App() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <BrowserRouter>

     <ScrollToTop />

     <Navbar setIsMenuOpen={setIsMenuOpen}/>
        <MobileMenu isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product-detail" element={<ProductDetail />} />
          <Route path="/add-To-cart" element={<AddToCart />} />

        </Routes>            
     <Footer />
     </BrowserRouter>
  )
}

export default App
