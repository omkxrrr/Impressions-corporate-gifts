import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { Truck, ShieldCheck, Gift, Star, ArrowRight } from 'lucide-react';

const Home = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col font-sans">
      {/* Hero Banner - Luxury Style */}
      <section className="relative bg-dark text-white min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop" 
            alt="Luxury Corporate Gifts" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-3/5 mb-10 md:mb-0">
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Premium Corporate Gifting</span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6">
              Elevate Your <br/><span className="text-primary">Corporate Relationships</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl font-light">
              Discover our exclusive collection of luxury gifts, meticulously crafted to leave a lasting impression on your clients and employees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/shop" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-primary hover:bg-primary-hover transition-colors duration-300 rounded-sm"
              >
                Explore Collection
              </Link>
              <a 
                href="#enquire" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border border-white hover:bg-white hover:text-dark transition-colors duration-300 rounded-sm"
              >
                Request Catalog
              </a>
            </div>
          </div>
          
          {/* Lead Form in Hero (Typical of landing pages) */}
          <div className="md:w-1/3 w-full" id="enquire">
            <div className="bg-white p-8 rounded-sm shadow-2xl text-dark">
              <h3 className="font-serif text-2xl font-bold mb-2">Bulk Enquiry</h3>
              <p className="text-gray-600 mb-6 text-sm">Get exclusive corporate pricing and custom branding.</p>
              <form onSubmit={(e) => { 
                e.preventDefault(); 
                const fd = new FormData(e.target);
                const message = encodeURIComponent(`Hello Impressions,\n\nI have a bulk corporate enquiry.\n\nName: ${fd.get('name')}\nCompany: ${fd.get('company')}\nPhone: ${fd.get('phone')}\nEmail: ${fd.get('email')}\n\nPlease share your catalog and bulk pricing.`);
                window.open(`https://wa.me/917620872092?text=${message}`, '_blank');
              }} className="space-y-4">
                <input name="name" required type="text" placeholder="Your Name" className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-primary" />
                <input name="company" required type="text" placeholder="Company Name" className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-primary" />
                <input name="phone" required type="tel" placeholder="Mobile Number" className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-primary" />
                <input name="email" required type="email" placeholder="Work Email" className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-primary" />
                <button type="submit" className="w-full bg-dark text-white font-bold py-4 rounded-sm hover:bg-black transition">
                  Get A Quote
                </button>
              </form>
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

      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-dark">Our Exquisite Collections</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Premium Drinkware", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800" },
              { title: "Luxury Desk Accessories", img: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=800" },
              { title: "Executive Electronics", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800" }
            ].map((cat, idx) => (
              <Link to="/shop" key={idx} className="group relative h-96 overflow-hidden bg-dark block">
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-50 group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="font-serif text-2xl font-bold text-white mb-4">{cat.title}</h3>
                  <span className="text-primary font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                    Explore <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-4xl font-bold text-dark">Trending Gifts</h2>
              <div className="w-16 h-1 bg-primary mt-6"></div>
            </div>
            <Link to="/shop" className="text-primary font-semibold hover:text-primary-hover mt-4 md:mt-0 flex items-center">
              View Entire Catalog <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
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
