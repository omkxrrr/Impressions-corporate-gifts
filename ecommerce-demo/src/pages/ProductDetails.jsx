import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { Star, Truck, ArrowLeft, Shield, RefreshCw } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for realistic feel
    setLoading(true);
    window.scrollTo(0, 0);
    
    setTimeout(() => {
      const found = products.find(p => p.id === parseInt(id));
      setProduct(found);
      setLoading(false);
    }, 400);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Optional: show toast notification here
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-square">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/800?text=Product+Image' }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="mb-2 text-sm text-blue-600 font-semibold uppercase tracking-wider">
              {product.category}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">({product.rating} / 5.0)</span>
            </div>

            <div className="mb-6 flex items-baseline gap-4">
              <span className="text-3xl font-extrabold text-gray-900">₹{product.price.toLocaleString()}</span>
              {product.oldPrice && (
                <span className="text-lg text-gray-500 line-through">₹{product.oldPrice.toLocaleString()}</span>
              )}
              {product.oldPrice && (
                <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                  {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="text-gray-600 text-base leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="mb-8">
              <span className="block text-sm font-medium text-gray-700 mb-2">Quantity</span>
              <div className="flex items-center border border-gray-300 rounded-md w-32">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-md w-1/3"
                >-</button>
                <span className="flex-1 text-center font-medium border-x border-gray-300 py-2">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-md w-1/3"
                >+</button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Only {product.stock} items left in stock</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-white border-2 border-blue-600 text-blue-600 font-bold py-3 px-8 rounded-md hover:bg-blue-50 transition"
              >
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-blue-600 border-2 border-blue-600 text-white font-bold py-3 px-8 rounded-md hover:bg-blue-700 transition shadow-md"
              >
                Buy Now
              </button>
            </div>

            {/* Delivery & Guarantees */}
            <div className="border-t border-gray-200 pt-6 mt-auto space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Truck className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                <span>Free delivery on orders over ₹1000. Dispatches in 24 hours.</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <RefreshCw className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                <span>30-day hassle-free returns.</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                <span>1 Year Warranty included.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
