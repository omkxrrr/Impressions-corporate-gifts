import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-50">
      {/* Top Luxury Announcement Micro-bar */}
      <div className="bg-dark text-gray-300 text-xs py-2 px-4 border-b border-white/10 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center tracking-wide">
          <div className="flex items-center space-x-3">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-medium text-gray-300">
              Authorized Corporate Gifting Partner to Fortune 500 Enterprises
            </span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">Custom Branding & Pan-India Dispatch</span>
          </div>
          <div className="flex items-center space-x-6 text-xs font-medium">
            <a href="tel:+917620872092" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <span>Direct Desk:</span>
              <span className="text-white font-semibold">+91 76208 72092</span>
            </a>
            <span className="text-gray-600">|</span>
            <a 
              href="https://wa.me/917620872092?text=Hello%20Impressions%20Team,%20I%20would%20like%20to%20request%20an%20executive%20corporate%20gifting%20catalog." 
              target="_blank" 
              rel="noreferrer" 
              className="text-primary hover:text-white transition-colors font-semibold flex items-center gap-1"
            >
              <span>VIP WhatsApp Desk</span>
            </a>
          </div>
        </div>
      </div>

      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center group">
                <img src="/logo.png" alt="Impressions Logo" className="h-20 sm:h-24 w-auto object-contain scale-[1.25] origin-left transition-transform duration-300 group-hover:scale-[1.28]" />
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-9 text-sm tracking-wider uppercase font-medium">
              <Link to="/" className="text-gray-800 hover:text-primary transition-colors relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all">
                Home
              </Link>
              <Link to="/shop" className="text-gray-800 hover:text-primary transition-colors relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all">
                Corporate Catalog
              </Link>
              <Link to="/about" className="text-gray-800 hover:text-primary transition-colors relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all">
                About Us
              </Link>
              <Link to="/contact" className="text-gray-800 hover:text-primary transition-colors relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all">
                Contact
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Link to="/shop" className="text-gray-600 hover:text-primary transition-colors p-2" title="Search Catalog">
                <Search className="w-5 h-5" />
              </Link>
              
              <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-red-500 transition-colors" title="Curated Shortlist">
                <Heart className="w-5 h-5" />
                {getWishlistCount() > 0 && (
                  <span className="absolute 1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>
              
              <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary transition-colors" title="Enquiry Basket">
                <ShoppingCart className="w-5 h-5" />
                {getCartCount() > 0 && (
                  <span className="absolute 1 right-1 bg-dark text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-primary">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* Executive Bulk Quote Button */}
              <a 
                href="/#enquire" 
                className="hidden lg:inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase text-dark bg-gradient-to-r from-amber-200 via-primary to-amber-500 hover:from-white hover:to-white hover:text-dark hover:ring-2 hover:ring-primary transition-all duration-300 shadow-sm"
              >
                Instant Quote
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <Link to="/wishlist" className="relative p-2 text-gray-700">
                <Heart className="w-5 h-5" />
                {getWishlistCount() > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative p-2 text-gray-700">
                <ShoppingCart className="w-5 h-5" />
                {getCartCount() > 0 && (
                  <span className="absolute top-1 right-1 bg-dark text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-primary">
                    {getCartCount()}
                  </span>
                )}
              </Link>
              <button onClick={toggleMenu} className="text-gray-700 hover:text-primary p-2">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/98 backdrop-blur-lg">
            <div className="px-4 pt-3 pb-6 space-y-2">
              <Link to="/" onClick={toggleMenu} className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-primary hover:bg-gray-50 rounded-lg">Home</Link>
              <Link to="/shop" onClick={toggleMenu} className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-primary hover:bg-gray-50 rounded-lg">Corporate Catalog</Link>
              <Link to="/about" onClick={toggleMenu} className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-primary hover:bg-gray-50 rounded-lg">About Us</Link>
              <Link to="/contact" onClick={toggleMenu} className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-primary hover:bg-gray-50 rounded-lg">Contact</Link>
              <a 
                href="/#enquire" 
                onClick={toggleMenu} 
                className="block text-center mt-3 py-3 rounded-lg text-sm font-semibold tracking-wider uppercase text-dark bg-gradient-to-r from-amber-200 via-primary to-amber-500"
              >
                Instant Bulk Quote
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
