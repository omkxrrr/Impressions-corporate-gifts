import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingCart, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const isLiked = isInWishlist(product.id);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-[0_12px_32px_rgba(203,152,52,0.15)] transition-all duration-500 overflow-hidden group border border-gray-200/90 hover:border-primary/50 flex flex-col h-full relative">
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden aspect-square bg-gray-50/60 p-4">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-contain object-center group-hover:scale-108 transition-transform duration-700 bg-white rounded-lg p-2"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Product+Image' }}
        />
        
        {/* Subtle Luxury Tag */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-gray-200/60 text-[10px] font-semibold tracking-wider uppercase text-gray-700 shadow-xs">
          Executive Choice
        </div>
      </Link>
      
      <button 
        onClick={handleWishlist}
        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white border border-gray-200/60 transition-all z-10"
        title="Add to Shortlist"
      >
        <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
      </button>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
          <span>{product.category}</span>
        </div>
        
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-serif font-bold text-gray-900 mb-1.5 line-clamp-1 hover:text-primary transition-colors text-base leading-snug">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed flex-grow">
          {product.shortDescription || product.description}
        </p>
        
        {/* Price Block */}
        <div className="mt-auto mb-4 pt-3 border-t border-gray-100 flex items-baseline justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Bulk Corporate Rate</div>
            <div className="flex items-baseline gap-2">
              {product.salePrice ? (
                <>
                  <span className="font-bold text-gray-900 text-lg">₹{parseFloat(product.salePrice).toLocaleString('en-IN')}</span>
                  <span className="text-xs text-gray-400 line-through">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
                </>
              ) : product.price ? (
                <span className="font-bold text-gray-900 text-lg">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
              ) : (
                <span className="text-xs font-semibold text-primary">Custom Quote</span>
              )}
            </div>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="bg-dark hover:bg-primary text-white hover:text-dark p-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow"
            title="Add to Corporate Enquiry"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
        
        <Link 
          to={`/product/${product.slug}`}
          className="text-center w-full py-2 px-3 text-xs font-semibold tracking-wider uppercase text-gray-700 bg-gray-50 hover:bg-dark hover:text-white rounded-lg transition-colors duration-200 border border-gray-200/80"
        >
          View Specifications
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
