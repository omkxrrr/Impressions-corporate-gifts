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
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full relative">
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden aspect-square">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Product+Image' }}
        />
      </Link>
      
      <button 
        onClick={handleWishlist}
        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors z-10"
      >
        <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:text-red-500'}`} />
      </button>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-1 tracking-wider uppercase">{product.category}</div>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-serif font-bold text-gray-900 mb-1 line-clamp-2 hover:text-primary transition-colors text-lg">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-grow">{product.shortDescription}</p>
        
        {/* Price Block */}
        <div className="mt-auto mb-3 flex items-end gap-2">
          {product.salePrice ? (
            <>
              <span className="font-bold text-gray-900 text-lg">₹{parseFloat(product.salePrice).toLocaleString('en-IN')}</span>
              <span className="text-sm text-gray-400 line-through mb-0.5">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
            </>
          ) : product.price ? (
            <span className="font-bold text-gray-900 text-lg">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
          ) : (
            <span className="text-sm font-medium text-gray-500">Price on Request</span>
          )}
        </div>
        
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <Link 
              to={`/product/${product.slug}`}
              className="text-primary text-sm font-semibold hover:underline"
            >
              View Details
            </Link>
            
            <button 
              onClick={handleAddToCart}
              className="bg-gray-100 hover:bg-primary text-gray-800 hover:text-white p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              title="Add to Enquiry"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
