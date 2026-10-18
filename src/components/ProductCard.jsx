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
    <div className="bg-white rounded-xl shadow-xs hover:shadow-[0_12px_32px_rgba(203,152,52,0.15)] transition-all duration-300 overflow-hidden group border border-gray-200/90 hover:border-primary/50 flex flex-col h-full relative">
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden aspect-square bg-gray-50/70 p-2 sm:p-4">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 bg-white rounded-lg p-1.5 sm:p-2"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Product+Image' }}
        />
        
        {/* Subtle Luxury Tag */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-gray-200/60 text-[8px] sm:text-[10px] font-semibold tracking-wider uppercase text-gray-700 shadow-xs">
          Executive
        </div>
      </Link>
      
      <button 
        onClick={handleWishlist}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white/90 backdrop-blur-xs rounded-full shadow-xs hover:bg-white border border-gray-200/60 transition-all z-10 cursor-pointer"
        title="Add to Shortlist"
      >
        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
      </button>
      
      <div className="p-2.5 sm:p-4 md:p-5 flex flex-col flex-grow">
        <div className="text-[9px] sm:text-[11px] font-bold tracking-wider text-primary uppercase mb-1 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-primary inline-block"></span>
          <span className="truncate">{product.category}</span>
        </div>
        
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-serif font-bold text-gray-900 mb-1 line-clamp-1 hover:text-primary transition-colors text-xs sm:text-sm md:text-base leading-snug">
            {product.name}
          </h3>
        </Link>
        <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-3 leading-relaxed flex-grow hidden xs:block">
          {product.shortDescription || product.description}
        </p>
        
        {/* Price Block */}
        <div className="mt-auto mb-2 sm:mb-3.5 pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between gap-1">
          <div className="min-w-0">
            <div className="text-[8px] sm:text-[10px] uppercase tracking-wider text-gray-400 font-medium truncate">Bulk Rate</div>
            <div className="flex items-baseline gap-1 sm:gap-2">
              {(() => {
                const effectivePrice = product.price || (() => {
                  const mrp = product.features?.find(f => typeof f === 'string' && f.toLowerCase().includes('mrp'));
                  if (mrp) {
                    const match = mrp.match(/(\d+[\d,.]*)/);
                    return match ? match[1].replace(/,/g, '') : null;
                  }
                  return null;
                })();

                if (product.salePrice) {
                  return (
                    <>
                      <span className="font-bold text-gray-900 text-xs sm:text-base md:text-lg">₹{parseFloat(product.salePrice).toLocaleString('en-IN')}</span>
                      {effectivePrice && (
                        <span className="text-[10px] sm:text-xs text-gray-400 line-through">₹{parseFloat(effectivePrice).toLocaleString('en-IN')}</span>
                      )}
                    </>
                  );
                }
                if (effectivePrice) {
                  return <span className="font-bold text-gray-900 text-xs sm:text-base md:text-lg">₹{parseFloat(effectivePrice).toLocaleString('en-IN')}</span>;
                }
                return <span className="text-[10px] sm:text-xs font-semibold text-primary">Custom Quote</span>;
              })()}
            </div>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="bg-dark hover:bg-primary text-white hover:text-dark p-1.5 sm:p-2.5 rounded-lg transition-all duration-300 shadow-xs shrink-0 cursor-pointer"
            title="Add to Corporate Enquiry"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
        
        <Link 
          to={`/product/${product.slug}`}
          className="text-center w-full py-1.5 sm:py-2 px-2 text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-gray-700 bg-gray-50 hover:bg-dark hover:text-white rounded-lg transition-colors duration-200 border border-gray-200/80 truncate block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
