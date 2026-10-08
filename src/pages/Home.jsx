import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { Truck, ShieldCheck, Gift, Star, ArrowRight } from 'lucide-react';

const Home = () => {
  const { products } = useProducts();
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 7);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 7);

  return (
    <div className="flex flex-col font-sans">
      {/* Hero Banner - Luxury Style */}
      <section className="relative bg-dark text-white min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop" 
            alt="Luxury Corporate Gifts" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-3/5">
            <span className="inline-block px-4 py-1 rounded-full border border-primary/50 bg-primary/10 text-primary font-bold tracking-widest uppercase text-xs mb-6 backdrop-blur-sm">
              Premium Corporate Gifting
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white drop-shadow-md">
              Elevate Your <br/><span className="text-primary italic">Corporate Relationships</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-xl font-light leading-relaxed">
              Discover our exclusive collection of luxury gifts, meticulously crafted to leave a lasting impression on your clients and employees.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link 
                to="/shop" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-dark bg-primary hover:bg-white transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Explore Collection
              </Link>
              <a 
                href="#enquire" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border border-gray-400 hover:border-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 rounded-lg"
              >
                Request Catalog
              </a>
            </div>
          </div>
          
          {/* Lead Form in Hero */}
          <div className="lg:w-2/5 w-full max-w-md mx-auto lg:mx-0" id="enquire">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl text-white">
              <h3 className="font-serif text-2xl font-bold mb-2">Bulk Enquiry</h3>
              <p className="text-gray-300 mb-6 text-sm">Get exclusive corporate pricing and custom branding.</p>
              <form onSubmit={(e) => { 
                e.preventDefault(); 
                const fd = new FormData(e.target);
                const message = encodeURIComponent(`Hello Impressions,\n\nI have a bulk corporate enquiry.\n\nName: ${fd.get('name')}\nCompany: ${fd.get('company')}\nPhone: ${fd.get('phone')}\nEmail: ${fd.get('email')}\n\nPlease share your catalog and bulk pricing.`);
                window.open(`https://wa.me/917620872092?text=${message}`, '_blank');
              }} className="space-y-4">
                <input name="name" required type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary text-white placeholder-gray-400 transition-colors" />
                <input name="company" required type="text" placeholder="Company Name" className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary text-white placeholder-gray-400 transition-colors" />
                <input name="phone" required type="tel" placeholder="Mobile Number" className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary text-white placeholder-gray-400 transition-colors" />
                <input name="email" required type="email" placeholder="Work Email" className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary text-white placeholder-gray-400 transition-colors" />
                <button type="submit" className="w-full bg-primary text-dark font-bold py-4 rounded-lg hover:bg-white transition-all duration-300 mt-2 shadow-lg">
                  Get A Quote
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Offers Banners Section */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Banner 1 */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg group h-64 sm:h-72 cursor-pointer">
              <img src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=1000" alt="Festive Offer" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center p-8 sm:p-10">
                <span className="text-primary font-bold text-sm tracking-wider uppercase mb-2">Festive Bonanza</span>
                <h3 className="text-white text-3xl font-serif font-bold mb-2">Flat 25% Off</h3>
                <p className="text-gray-300 mb-6 max-w-xs">On bulk orders of Premium Diwali Gift Hampers.</p>
                <Link to="/shop" className="inline-table bg-white text-dark font-semibold px-6 py-2 rounded-full w-max hover:bg-primary transition-colors">
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Banner 2 */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg group h-64 sm:h-72 cursor-pointer">
              <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000" alt="Fitness Gear" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-l from-black/80 to-transparent flex flex-col justify-center items-end text-right p-8 sm:p-10">
                <span className="text-primary font-bold text-sm tracking-wider uppercase mb-2">Corporate Wellness</span>
                <h3 className="text-white text-3xl font-serif font-bold mb-2">Fitness Gear</h3>
                <p className="text-gray-300 mb-6 max-w-xs">Encourage a healthy lifestyle with premium fitness gifts.</p>
                <Link to="/shop" className="inline-table bg-primary text-dark font-semibold px-6 py-2 rounded-full w-max hover:bg-white transition-colors">
                  Explore
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-gray-100 py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm font-semibold uppercase tracking-widest mb-6">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
            {/* Dummy Logos */}
            <h4 className="font-serif text-2xl font-bold text-gray-700">TATA</h4>
            <h4 className="font-serif text-2xl font-bold text-gray-700">RELIANCE</h4>
            <h4 className="font-serif text-2xl font-bold text-gray-700">HDFC</h4>
            <h4 className="font-serif text-2xl font-bold text-gray-700">INFOSYS</h4>
            <h4 className="font-serif text-2xl font-bold text-gray-700">WIPRO</h4>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-dark">Shop By Top Brands</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Adidas", query: "Adidas", img: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=800" },
              { title: "Arrow", query: "Arrow", img: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800" },
              { title: "UCB (Benetton)", query: "UCB", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800" },
              { title: "French Connection", query: ["French Connection", "FCUK", "fc-"], img: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800" },
              { title: "Jack & Jones", query: ["Jack Jones", "Jack & Jones", "Jack and Jones", "Jack&Jones", "vilmar", "ethan", "asger", "kornad", "austin", "nashville", "madd polo", "plain polo", "jacquard", "interlock", "viktor", "coolmax", "slt", "joren", "icero", "demian", "carline"], img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800" },
              { title: "Monte Carlo", query: "Monte Carlo", img: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=800" },
              { title: "Puma", query: "Puma", img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800" },
              { title: "Nike", query: "Nike", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800" }
            ].map((brand, idx) => {
              const terms = Array.isArray(brand.query) ? brand.query.map(t => t.toLowerCase()) : [brand.query.toLowerCase()];
              const brandCount = products.filter(p => 
                terms.some(term => 
                  p.name.toLowerCase().includes(term) || 
                  (p.description && p.description.toLowerCase().includes(term)) ||
                  (p.features && p.features.some(f => f.toLowerCase().includes(term))) ||
                  (p.sku && p.sku.toLowerCase().includes(term))
                )
              ).length;
              
              if (brandCount === 0 && (brand.title === "Puma" || brand.title === "Nike")) return null; // Hide Puma/Nike if no products yet
              
              return (
                <Link to={`/shop?search=${Array.isArray(brand.query) ? brand.query[0] : brand.query}`} key={idx} className="group relative h-72 overflow-hidden bg-dark block rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <img src={brand.img} alt={brand.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition duration-700" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="font-serif text-3xl font-bold text-white mb-2 tracking-wide shadow-black drop-shadow-lg">{brand.title}</h3>
                    <span className="text-white text-sm bg-black/50 px-3 py-1 rounded-full mb-4 backdrop-blur-sm shadow-sm">{brandCount} Products</span>
                    <span className="bg-primary text-white font-medium px-5 py-2 rounded-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                      Explore <ArrowRight className="ml-2 w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-300px * ${displayProducts.length} - 1.5rem * ${displayProducts.length})); }
          }
          .animate-continuous-scroll {
            animation: scroll 25s linear infinite;
            width: max-content;
          }
          .animate-continuous-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-dark">Trending Gifts</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-6"></div>
          </div>
          
          <div className="mb-16 relative">
            <div className="flex gap-6 animate-continuous-scroll">
              {[...displayProducts, ...displayProducts, ...displayProducts].map((product, idx) => (
                <div key={`${product.id}-${idx}`} className="w-[300px] shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center relative z-20">
            <Link to="/shop" className="group flex items-center gap-3 bg-dark text-white font-medium text-lg px-10 py-4 rounded-full hover:bg-black transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
              View Entire Catalog 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-dark text-white text-center border-t-4 border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold mb-4">The Impressions Advantage</h2>
          <p className="text-gray-400 mb-16 max-w-2xl mx-auto">Delivering excellence in every box with unmatched personalization and quality.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="flex flex-col items-center">
              <Gift className="w-12 h-12 text-primary mb-6" />
              <h3 className="font-serif text-xl font-bold mb-3">Bespoke Customization</h3>
              <p className="text-gray-400 text-sm">Your logo intricately engraved, embossed, or printed with precision.</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-12 h-12 text-primary mb-6" />
              <h3 className="font-serif text-xl font-bold mb-3">Premium Quality</h3>
              <p className="text-gray-400 text-sm">Curated products that meet the highest standards of luxury.</p>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-12 h-12 text-primary mb-6" />
              <h3 className="font-serif text-xl font-bold mb-3">Secure Packaging</h3>
              <p className="text-gray-400 text-sm">Elegant presentation boxes designed to impress and protect.</p>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="w-12 h-12 text-primary mb-6" />
              <h3 className="font-serif text-xl font-bold mb-3">Pan India Delivery</h3>
              <p className="text-gray-400 text-sm">Timely and safe delivery to multiple offices or direct to homes.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
