import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { Truck, ShieldCheck, Gift, Star, ArrowRight, Award, CheckCircle2, PhoneCall, Sparkles } from 'lucide-react';

const Home = () => {
  const { products } = useProducts();
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 7);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 7);

  return (
    <div className="flex flex-col font-sans bg-white selection:bg-primary selection:text-dark">
      
      {/* 1. Hero Banner - Modern Corporate Elite */}
      <section className="relative bg-[#0c0e14] text-white min-h-[92vh] flex items-center overflow-hidden">
        {/* Ambient Gold Radial Glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none"></div>
        
        {/* Background Image with Dark Cinematic Vignette */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop" 
            alt="Luxury Corporate Gifting Showcase" 
            className="w-full h-full object-cover opacity-25 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0e14] via-[#0c0e14]/85 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center justify-between gap-14">
          <div className="lg:w-7/12">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/50 bg-primary/15 text-amber-300 font-bold tracking-[0.2em] uppercase text-xs mb-8 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>The Gold Standard in Corporate Gifting</span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-white tracking-tight">
              Architecting Lasting <br/>
              <span className="bg-gradient-to-r from-amber-200 via-primary to-amber-500 bg-clip-text text-transparent italic font-serif">
                Corporate Legacies
              </span>
            </h1>
            
            <p className="text-base sm:text-xl text-gray-300 mb-10 max-w-xl font-light leading-relaxed">
              Curated luxury apparel, bespoke leathercraft, and authorized global brand gifting suites tailored for India's foremost corporate leaders and delegations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link 
                to="/shop" 
                className="group inline-flex items-center justify-center px-8 py-4 text-sm font-semibold tracking-wider uppercase text-dark bg-gradient-to-r from-amber-200 via-primary to-amber-500 hover:from-white hover:to-white hover:text-dark transition-all duration-300 rounded-lg shadow-[0_4px_25px_rgba(203,152,52,0.35)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.4)] hover:-translate-y-0.5"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <a 
                href="#enquire" 
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold tracking-wider uppercase text-white border border-white/20 hover:border-primary hover:bg-primary/10 backdrop-blur-md transition-all duration-300 rounded-lg"
              >
                Request Proposal
              </a>
            </div>

            {/* Quick Trust Highlights */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-lg">
              <div>
                <div className="text-2xl font-bold text-white font-serif">500+</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Enterprise Clients</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-serif">100K+</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Gifts Curated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-serif">100%</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Brand Authenticity</div>
              </div>
            </div>

          </div>
          
          {/* Executive RFQ / Bulk Lead Card */}
          <div className="lg:w-5/12 w-full max-w-md mx-auto lg:mx-0" id="enquire">
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-primary/50 via-white/10 to-transparent shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
              <div className="bg-[#12151e]/95 backdrop-blur-xl p-8 rounded-2xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-2xl font-bold text-white">Corporate Enquiry</h3>
                  <span className="px-2.5 py-1 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/30">
                    B2B Desk
                  </span>
                </div>
                <p className="text-gray-400 mb-6 text-xs leading-relaxed">
                  Request custom mockups, branded sample kits, and volume corporate rates within 2 business hours.
                </p>
                <form onSubmit={(e) => { 
                  e.preventDefault(); 
                  const fd = new FormData(e.target);
                  const message = encodeURIComponent(`Hello Impressions Executive Team,\n\nI would like to request a bulk corporate gifting proposal.\n\n• Name: ${fd.get('name')}\n• Organization: ${fd.get('company')}\n• Contact: ${fd.get('phone')}\n• Work Email: ${fd.get('email')}\n\nPlease share your curated corporate catalog and volume pricing.`);
                  window.open(`https://wa.me/917620872092?text=${message}`, '_blank');
                }} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-medium text-gray-400 mb-1.5">Executive Name</label>
                    <input name="name" required type="text" placeholder="e.g. Rahul Sharma" className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-lg focus:outline-none focus:border-primary text-white text-sm placeholder-gray-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-medium text-gray-400 mb-1.5">Company / Enterprise</label>
                    <input name="company" required type="text" placeholder="e.g. Deloitte India" className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-lg focus:outline-none focus:border-primary text-white text-sm placeholder-gray-500 transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-medium text-gray-400 mb-1.5">Phone Number</label>
                      <input name="phone" required type="tel" placeholder="+91 ..." className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-lg focus:outline-none focus:border-primary text-white text-sm placeholder-gray-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-medium text-gray-400 mb-1.5">Work Email</label>
                      <input name="email" required type="email" placeholder="name@company.com" className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-lg focus:outline-none focus:border-primary text-white text-sm placeholder-gray-500 transition-colors" />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-amber-200 via-primary to-amber-500 hover:from-white hover:to-white hover:text-dark text-dark font-bold text-xs uppercase tracking-widest py-4 rounded-lg transition-all duration-300 mt-2 shadow-lg flex items-center justify-center gap-2">
                    <span>Submit Executive Enquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Industry Leaders & Fortune 500 Trust Bar */}
      <section className="bg-[#12151e] py-10 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-primary-light text-xs font-bold uppercase tracking-[0.25em] mb-8">
            Trusted By Procurement Heads at India's Foremost Enterprises
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 text-gray-400 font-serif font-bold text-xl md:text-2xl tracking-widest opacity-70">
            <span className="hover:text-primary transition-colors cursor-default">TATA</span>
            <span className="text-gray-700 font-sans font-light">|</span>
            <span className="hover:text-primary transition-colors cursor-default">RELIANCE</span>
            <span className="text-gray-700 font-sans font-light">|</span>
            <span className="hover:text-primary transition-colors cursor-default">HDFC BANK</span>
            <span className="text-gray-700 font-sans font-light">|</span>
            <span className="hover:text-primary transition-colors cursor-default">INFOSYS</span>
            <span className="text-gray-700 font-sans font-light">|</span>
            <span className="hover:text-primary transition-colors cursor-default">WIPRO</span>
            <span className="text-gray-700 font-sans font-light">|</span>
            <span className="hover:text-primary transition-colors cursor-default">MAHINDRA</span>
          </div>
        </div>
      </section>

      {/* 3. Curated Corporate Gifting Suites (Elevated Promotional Banners) */}
      <section className="py-20 bg-gray-50/70 border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-bold text-xs tracking-[0.25em] uppercase block mb-3">Curated Gifting Portfolios</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-dark">Tailored Corporate Suites</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-5"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Suite 1: Luxury Apparel */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl group h-80 sm:h-96 cursor-pointer border border-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200" 
                alt="Executive Apparel Suite" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent flex flex-col justify-center p-8 sm:p-12">
                <span className="text-amber-300 font-bold text-xs tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Corporate Wardrobe Suite
                </span>
                <h3 className="text-white text-3xl sm:text-4xl font-serif font-bold mb-3">
                  Executive Apparel & Tailoring
                </h3>
                <p className="text-gray-300 mb-8 max-w-sm text-sm leading-relaxed">
                  Authorized Jack & Jones, Monte Carlo, Arrow & French Connection tailored polyesters, satin shirts, and jackets.
                </p>
                <Link 
                  to="/shop" 
                  className="inline-flex items-center gap-2 bg-white text-dark hover:bg-primary font-bold text-xs uppercase tracking-wider px-7 py-3 rounded-full w-max transition-all duration-300 shadow-md"
                >
                  <span>Explore Wardrobe Suite</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Suite 2: Corporate Wellness & Athletic */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl group h-80 sm:h-96 cursor-pointer border border-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200" 
                alt="Corporate Wellness Suite" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent flex flex-col justify-center p-8 sm:p-12">
                <span className="text-amber-300 font-bold text-xs tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Corporate Wellness & Tech
                </span>
                <h3 className="text-white text-3xl sm:text-4xl font-serif font-bold mb-3">
                  High-Performance Activewear
                </h3>
                <p className="text-gray-300 mb-8 max-w-sm text-sm leading-relaxed">
                  Empower employee health with official Adidas, Puma, and sports-technology tracksuits, bags, and accessories.
                </p>
                <Link 
                  to="/shop" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-200 via-primary to-amber-500 text-dark font-bold text-xs uppercase tracking-wider px-7 py-3 rounded-full w-max hover:bg-white transition-all duration-300 shadow-md"
                >
                  <span>Explore Active Suite</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Authorized Brand Portfolios */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-primary font-bold text-xs tracking-[0.25em] uppercase block mb-3">Authorized Distribution</span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-dark">Premier Brand Partners</h2>
              <div className="w-16 h-1 bg-primary mt-5"></div>
            </div>
            <p className="text-gray-500 text-sm max-w-md mt-4 md:mt-0 leading-relaxed">
              Every item is guaranteed 100% genuine, backed by official warranty certificates and custom enterprise co-branding.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
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
              
              if (brandCount === 0 && (brand.title === "Puma" || brand.title === "Nike")) return null;
              
              return (
                <Link 
                  to={`/shop?search=${Array.isArray(brand.query) ? brand.query[0] : brand.query}`} 
                  key={idx} 
                  className="group relative h-80 overflow-hidden bg-[#0c0e14] block rounded-2xl shadow-md hover:shadow-[0_16px_36px_rgba(203,152,52,0.22)] border border-gray-200/60 hover:border-primary transition-all duration-500 transform hover:-translate-y-2"
                >
                  <img 
                    src={brand.img} 
                    alt={brand.title} 
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-35 group-hover:scale-110 transition duration-700" 
                  />
                  <div className="absolute inset-0 flex flex-col justify-between p-6 text-center">
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-amber-300 bg-black/80 px-3 py-1 rounded-full border border-amber-400/60 backdrop-blur-md shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        Official Channel
                      </span>
                      <span className="text-white text-xs font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/30">
                        {brandCount} Items
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-3xl font-bold text-white mb-3 tracking-wide drop-shadow-md">
                        {brand.title}
                      </h3>
                      <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-dark bg-gradient-to-r from-amber-200 via-primary to-amber-500 px-5 py-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 shadow-md">
                        <span>Browse Catalog</span>
                        <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div className="h-2"></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Trending Gifts / Marquee Showcase */}
      <section className="py-24 bg-[#0d0f16] text-white overflow-hidden relative border-y border-white/10">
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-315px * ${displayProducts.length} - 1.5rem * ${displayProducts.length})); }
          }
          .animate-continuous-scroll {
            animation: scroll 28s linear infinite;
            width: max-content;
          }
          .animate-continuous-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
        
        {/* Subtle Ambient light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary font-bold text-xs tracking-[0.25em] uppercase block mb-3">Executive Showcase</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">Trending Procurement Gifts</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-5"></div>
            <p className="text-gray-400 text-sm max-w-lg mx-auto mt-4 font-light">
              Hover on any product to pause and inspect detailed corporate specifications.
            </p>
          </div>
          
          <div className="mb-16 relative">
            <div className="flex gap-6 animate-continuous-scroll">
              {[...displayProducts, ...displayProducts, ...displayProducts].map((product, idx) => (
                <div key={`${product.id}-${idx}`} className="w-[315px] shrink-0 text-gray-900">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center relative z-20">
            <Link 
              to="/shop" 
              className="group flex items-center gap-3 bg-gradient-to-r from-amber-200 via-primary to-amber-500 hover:from-white hover:to-white text-dark font-bold text-xs uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 shadow-[0_4px_25px_rgba(203,152,52,0.35)] hover:-translate-y-1"
            >
              <span>View Entire 400+ Product Catalog</span> 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. The Impressions Advantage - Executive Concierge Standard */}
      <section className="py-24 bg-white text-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-primary font-bold text-xs tracking-[0.25em] uppercase block mb-3">The Concierge Standard</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold">The Impressions Advantage</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-5"></div>
            <p className="text-gray-500 max-w-xl mx-auto mt-4 text-sm leading-relaxed">
              Elevating corporate gifting from transactional orders into high-touch relationship management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            
            <div className="p-8 rounded-2xl bg-gray-50/80 border border-gray-200 hover:border-primary transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-dark text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Gift className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Precision Co-Branding</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Precision UV printing, debossing, hot-foil stamping, and laser engraving matching exact pantone guidelines.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50/80 border border-gray-200 hover:border-primary transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-dark text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Guaranteed Provenance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Authorized corporate distribution ensuring 100% genuine products with manufacturer warranty certificates.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50/80 border border-gray-200 hover:border-primary transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-dark text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Bespoke Unboxing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Rigid magnetic-closure presentation cases, custom satin ribbon pulls, and personalized wax-sealed greeting cards.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50/80 border border-gray-200 hover:border-primary transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-dark text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">White-Glove Logistics</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Individual address dropshipping directly to CXO homes or bulk consolidated dispatch to corporate headquarters.
              </p>
            </div>

          </div>

          {/* VIP Direct Concierge Banner */}
          <div className="rounded-2xl p-8 sm:p-12 bg-gradient-to-r from-[#0c0e14] via-[#141824] to-[#0c0e14] text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl">
            <div className="max-w-xl">
              <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-2">Dedicated B2B Desk</span>
              <h4 className="font-serif text-2xl sm:text-3xl font-bold mb-2">Planning an Annual Summit or Executive Retreat?</h4>
              <p className="text-gray-400 text-sm">
                Speak directly with our senior corporate gifting consultant for bespoke curation, mockups, and priority SLAs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <a 
                href="https://wa.me/917620872092?text=Hello%20Impressions%20Team,%20I%20have%20an%20urgent%20corporate%20summit%20gifting%20requirement."
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-green-600 hover:bg-green-700 font-bold text-xs uppercase tracking-wider text-white transition-colors"
              >
                <span>WhatsApp Consultant</span>
              </a>
              <a 
                href="tel:+917620872092"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 font-bold text-xs uppercase tracking-wider text-white transition-colors"
              >
                <span>Call +91 76208 72092</span>
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
