import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';
import { Star, Truck, ArrowLeft, Shield, RefreshCw, Heart, ChevronRight, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { BrandLogo, BrandCornerBadge } from '../components/BrandLogo';
import { detectBrand } from '../utils/catalogCategories';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { products, loading: contextLoading } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (contextLoading) return;
    setLoading(true);
    window.scrollTo(0, 0);
    
    setTimeout(() => {
      const found = products.find(p => p.slug === slug);
      if (found) {
        setProduct(found);
        setMainImage(found.images[0]);
        // Find related products (same category, excluding current)
        const related = products.filter(p => p.category === found.category && p.id !== found.id).slice(0, 4);
        // If not enough related, just add some popular ones
        if (related.length < 4) {
          const others = products.filter(p => p.id !== found.id && p.category !== found.category).slice(0, 4 - related.length);
          setRelatedProducts([...related, ...others]);
        } else {
          setRelatedProducts(related);
        }
      }
      setLoading(false);
    }, 200);
  }, [slug, products, contextLoading]);

  if (loading || contextLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    const message = encodeURIComponent(`Hello Impressions, I would like to request a quote for:\n*${product.name}* (Quantity: ${quantity})\n\nPlease provide bulk pricing and customization options.`);
    window.open(`https://wa.me/917620872092?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link to="/shop" className="hover:text-primary transition">Shop</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="hover:text-primary transition cursor-pointer">{product.category}</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-square mb-4 transition-opacity duration-300 group relative">
              <img 
                src={mainImage || product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-contain object-center transform group-hover:scale-110 transition-transform duration-700 origin-center bg-white"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/800?text=Product+Image' }}
              />
              <BrandCornerBadge product={product} position="top-left" />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <button 
                    key={index} 
                    onClick={() => setMainImage(img)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 focus:outline-none ${mainImage === img ? 'border-primary opacity-100 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-200'}`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-contain bg-white" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-1/2 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm text-primary font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                {(() => {
                  const brand = detectBrand(product);
                  if (!brand || brand === 'Unbranded' || brand === 'Corporate Collection') return null;
                  return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark text-amber-300 text-xs font-bold tracking-wider uppercase border border-primary/30 shadow-xs">
                      <BrandLogo brand={brand} size="xs" />
                      <span>{brand}</span>
                    </span>
                  );
                })()}
              </div>
              <button 
                onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                title="Toggle Wishlist"
              >
                <Heart className={`w-6 h-6 transition-colors ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
              </button>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{product.name}</h1>

            <p className="text-gray-600 text-base leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Price Block with B2B Volume Pricing Callout */}
            <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 border border-amber-500/30 inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Corporate B2B Catalog
                </span>
                <span className="text-xs text-gray-500 font-medium">Indicative MRP / Reference</span>
              </div>

              <div className="my-2.5">
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
                      <div className="flex items-center gap-3">
                        <span className="text-3xl sm:text-4xl font-bold text-gray-900">₹{parseFloat(product.salePrice).toLocaleString('en-IN')}</span>
                        {effectivePrice && (
                          <span className="text-xl text-gray-400 line-through">₹{parseFloat(effectivePrice).toLocaleString('en-IN')}</span>
                        )}
                        {effectivePrice && (
                          <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                            {Math.round(((effectivePrice - product.salePrice) / effectivePrice) * 100)}% OFF
                          </span>
                        )}
                      </div>
                    );
                  }
                  if (effectivePrice) {
                    return (
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-bold text-gray-900">₹{parseFloat(effectivePrice).toLocaleString('en-IN')}</span>
                        <span className="text-xs text-gray-500 font-medium">/ unit baseline MRP</span>
                      </div>
                    );
                  }
                  return <div className="text-2xl font-bold text-primary">Price on Request</div>;
                })()}
              </div>

              {/* Volume Request Notice */}
              <div className="pt-3 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-700">
                <div className="flex items-center gap-2 font-semibold text-amber-950">
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                  <span>Request for best price on quantity (Tiered Bulk Rates)</span>
                </div>
                <span className="text-[11px] text-gray-500 font-medium">Bulk discounts for 25, 50, 100, 500+ pcs</span>
              </div>
            </div>

            {/* Quantity Selector with Quick Bulk Presets */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-800">Estimated Quantity</span>
                <span className="text-xs text-primary font-medium">Bulk tiers available</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg w-32 bg-white">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg w-1/3 transition"
                  >-</button>
                  <span className="flex-1 text-center font-bold border-x border-gray-300 py-2 text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg w-1/3 transition"
                  >+</button>
                </div>

                {/* Quick Corporate Volume Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[25, 50, 100, 250, 500].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setQuantity(tier)}
                      className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${quantity === tier ? 'bg-dark text-amber-300 border-dark shadow-xs' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-primary/60 hover:bg-white'}`}
                    >
                      {tier} pcs
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-white border-2 border-primary text-primary font-bold py-3 px-8 rounded-md hover:bg-gray-50 transition"
              >
                Add to Enquiry
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-primary border-2 border-primary text-white font-bold py-3 px-8 rounded-md hover:bg-primary-hover transition shadow-md"
              >
                Request Quote
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Product Information</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 list-none">
                {product.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2 mt-1 flex-shrink-0">•</span>
                    <span className="break-words">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 font-serif">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relProduct => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
        
        {/* Back to Shop */}
        <div className="mt-16 text-center">
          <Link 
            to="/shop" 
            className="inline-flex items-center text-primary font-medium hover:underline text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
