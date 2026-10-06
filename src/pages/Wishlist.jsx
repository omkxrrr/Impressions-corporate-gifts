import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { Heart, Trash2, ArrowRight } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="bg-gray-50 min-h-[70vh] flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-white p-10 rounded-xl shadow-sm text-center max-w-md w-full border border-gray-100">
          <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Save products you love for later.</p>
          <Link 
            to="/shop" 
            className="inline-block bg-primary text-white font-medium py-3 px-8 rounded-md hover:bg-primary-hover transition shadow-sm"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600 mb-8">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {wishlist.map(item => (
              <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:bg-gray-50 transition-colors">
                <Link to={`/product/${item.slug}`} className="flex-shrink-0 w-32 h-32 border border-gray-200 rounded-md overflow-hidden bg-gray-50">
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    className="w-full h-full object-cover object-center"
                  />
                </Link>
                
                <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{item.category}</div>
                  <Link to={`/product/${item.slug}`} className="text-lg font-bold text-gray-900 hover:text-primary transition-colors mb-2">
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-2 max-w-2xl">{item.shortDescription}</p>
                </div>
                
                <div className="flex sm:flex-col gap-3 justify-center items-center sm:items-end w-full sm:w-auto mt-4 sm:mt-0">
                  <Link 
                    to={`/product/${item.slug}`}
                    className="flex-1 sm:flex-none flex items-center justify-center bg-white border border-primary text-primary hover:bg-primary hover:text-white font-medium py-2 px-4 rounded-md transition-colors whitespace-nowrap"
                  >
                    View Product
                  </Link>
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="flex items-center justify-center text-gray-400 hover:text-red-500 p-2 rounded-md transition-colors focus:outline-none"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-8 text-center sm:text-left">
          <Link to="/shop" className="inline-flex items-center text-primary font-medium hover:underline">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
