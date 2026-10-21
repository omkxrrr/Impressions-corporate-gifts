import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { BrandLogo } from '../components/BrandLogo';
import { useProducts } from '../context/ProductContext';
import { Truck, ShieldCheck, Gift, Star, ArrowRight, Award, CheckCircle2, PhoneCall, Sparkles, Shirt, Briefcase, Activity, Layers } from 'lucide-react';
import { matchesBrand, detectBrand, matchesSubCatalog } from '../utils/catalogCategories';

const Home = () => {
  const { products } = useProducts();

  // Dynamic brand partners for the marquee slider
  const dynamicBrandPartners = useMemo(() => {
    const BRAND_METADATA = {
      'Jack & Jones': {
        categoryNote: 'Polos, Tees & Jackets',
        fallbackImg: 'https://dcvqsfwoodnotkujbbyj.supabase.co/storage/v1/object/public/products/catalogue//P28.jpg',
        defaultCount: 42
      },
      'Monte Carlo': {
        categoryNote: 'Oxford Shirts & Knitwear',
        preferredSku: 'P38',
        preferredFilter: (p) => p.sku === 'P38' || (p.name && p.name.toLowerCase().includes('oxford shirt')),
        fallbackImg: 'https://dcvqsfwoodnotkujbbyj.supabase.co/storage/v1/object/public/products/catalogue/P38/P38.jpg',
        zoomClass: 'w-full h-full object-cover scale-[2.4] object-center group-hover:scale-[2.55]',
        defaultCount: 38
      },
      'UCB (Benetton)': {
        categoryNote: 'Polo T-Shirts & Casuals',
        fallbackImg: 'https://dcvqsfwoodnotkujbbyj.supabase.co/storage/v1/object/public/products/catalogue/UCB001/UCB001.jpg',
        defaultCount: 16
      },
      'French Connection': {
        categoryNote: 'Premium Shirts & Polos',
        fallbackImg: 'https://dcvqsfwoodnotkujbbyj.supabase.co/storage/v1/object/public/products/catalogue/FC-P05-01/FC-P05-01.jpg',
        defaultCount: 28
      },
      'Arrow': {
        categoryNote: 'Executive Formal Wear',
        preferredFilter: (p) => (p.sku && p.sku.startsWith('ARIK')) || (p.name && p.name.toLowerCase().includes('tipping')),
        fallbackImg: 'https://dcvqsfwoodnotkujbbyj.supabase.co/storage/v1/object/public/products/catalogue/ARIK7032/ARIK7032.jpg',
        zoomClass: 'w-full h-full object-cover scale-[2.2] object-center group-hover:scale-[2.35]',
        defaultCount: 14
      },
      'Adidas': {
        categoryNote: 'Sports Tech & Trackwear',
        preferredFilter: (p) => p.name && (p.name.toLowerCase().includes('poly cotton tshirt') || p.name.toLowerCase().includes('tipping tshirt') || p.name.toLowerCase().includes('dryfit tshirt')),
        fallbackImg: 'https://dcvqsfwoodnotkujbbyj.supabase.co/storage/v1/object/public/products/catalogue/CD1486/CD1486.jpg',
        defaultCount: 56
      },
      'Rare Rabbit': {
        categoryNote: 'Designer Polos & Formal Shirts',
        preferredSku: 'RR-P09',
        fallbackImg: 'https://dcvqsfwoodnotkujbbyj.supabase.co/storage/v1/object/public/products/catalogue/RR-P09/RR-P09.jpg',
        defaultCount: 33
      },
      'Reebok': {
        categoryNote: 'Performance Polos & Athletic Jackets',
        preferredSku: 'INPS00101',
        fallbackImg: 'https://dcvqsfwoodnotkujbbyj.supabase.co/storage/v1/object/public/products/catalogue/INPS00101/INPS00101.jpg',
        defaultCount: 33
      },
      'Scott International': {
        categoryNote: 'Premium Tipped Polos & Bio-Wash Tees',
        preferredSku: 'SP-1',
        fallbackImg: 'https://dcvqsfwoodnotkujbbyj.supabase.co/storage/v1/object/public/products/catalogue/SP-1/SP-1.jpg',
        defaultCount: 27
      },
      'Puma': {
        categoryNote: 'Activewear & Athleisure',
        preferredSku: '67728601',
        fallbackImg: 'https://dcvqsfwoodnotkujbbyj.supabase.co/storage/v1/object/public/products/catalogue/67728601/67728601.jpg',
        defaultCount: 30
      },
      'Nike': {
        categoryNote: 'Performance Sportswear',
        defaultCount: 22
      }
    };

    const brandsMap = new Map();

    // 1. Seed with known partner houses
    Object.keys(BRAND_METADATA).forEach(bName => {
      brandsMap.set(bName, {
        title: bName,
        ...BRAND_METADATA[bName]
      });
    });

    // 2. Discover any newly imported brands dynamically from database products
    (products || []).forEach(p => {
      const detected = detectBrand(p);
      if (detected && detected !== 'Unbranded' && detected !== 'Corporate Collection' && !brandsMap.has(detected)) {
        brandsMap.set(detected, {
          title: detected,
          categoryNote: 'Corporate Apparel & Merchandise',
          defaultCount: 0
        });
      }
    });

    // 3. Keep only active brands that have products or placeholders
    return Array.from(brandsMap.values()).filter(b => {
      const matchCount = (products || []).filter(p => matchesBrand(p, b.title)).length;
      return matchCount > 0 || b.title === 'Puma' || b.title === 'Nike';
    });
  }, [products]);

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

      {/* 3. Apparel Catalog & Sub-Catalogues (Category-Wise Gifting Portfolios) */}
      <section className="py-28 bg-[#090b10] text-white relative overflow-hidden border-y border-white/10">
        {/* Ambient Gold Radial Glows */}
        <div className="absolute -top-24 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="absolute -bottom-24 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-18">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-amber-300 font-bold tracking-[0.25em] uppercase text-xs mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Executive Wardrobe Architecture</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Curated Apparel & <span className="bg-gradient-to-r from-amber-200 via-primary to-amber-500 bg-clip-text text-transparent italic">Sub-Catalogues</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-300 to-primary mx-auto mt-5 rounded-full"></div>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mt-4 font-light leading-relaxed">
              Architected for corporate delegations, leadership summits, and bespoke gifting. Select any tier to explore verified brand styles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
            {[
              {
                id: 't-shirts',
                suiteNo: 'SUITE 01',
                subBadge: 'TACTILE KNITWEAR',
                title: 'T-Shirts & Polos',
                shortCta: 'Polos & Tees',
                IconComp: Shirt,
                image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop',
                tagline: 'Polo shirts, dryfit technical tees, tipping collars & bespoke casuals.',
                brands: ['Jack & Jones', 'UCB (Benetton)', 'Arrow', 'Monte Carlo', 'Adidas', 'French Connection']
              },
              {
                id: 'shirts',
                suiteNo: 'SUITE 02',
                subBadge: 'FORMAL TAILORING',
                title: 'Formal & Oxford Shirts',
                shortCta: 'Oxford Shirts',
                IconComp: Briefcase,
                image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
                tagline: '100% Egyptian Oxford, Giza Gilt, woven executive & presidential shirts.',
                brands: ['Monte Carlo', 'Arrow', 'French Connection', 'Jack & Jones']
              },
              {
                id: 'pants',
                suiteNo: 'SUITE 03',
                subBadge: 'PERFORMANCE BOTTOMS',
                title: 'Pants & Tracksuits',
                shortCta: 'Track & Pants',
                IconComp: Activity,
                image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800&auto=format&fit=crop',
                tagline: 'Executive track suits, active joggers, corporate chinos & bespoke trousers.',
                brands: ['Monte Carlo', 'Adidas', 'Puma']
              },
              {
                id: 'jackets',
                suiteNo: 'SUITE 04',
                subBadge: 'OUTERWEAR & SUEDE',
                title: 'Jackets & Outerwear',
                shortCta: 'Outerwear Suite',
                IconComp: ShieldCheck,
                image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
                tagline: 'Bespoke suede jackets, winterwear, hoodies, corporate blazers & coats.',
                brands: ['Jack & Jones', 'Monte Carlo', 'French Connection']
              }
            ].map((cat) => {
              const IconComponent = cat.IconComp;
              return (
                <div 
                  key={cat.id}
                  className="group relative rounded-3xl overflow-hidden bg-[#11141e] border border-white/10 hover:border-primary/70 shadow-[0_16px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_24px_60px_rgba(203,152,52,0.22)] transition-all duration-500 flex flex-col justify-between transform hover:-translate-y-2"
                >
                  {/* Visual Editorial Header with High Fashion Photo */}
                  <div className="relative h-52 w-full overflow-hidden bg-[#0c0e14]">
                    <img 
                      src={cat.image} 
                      alt={cat.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-75 group-hover:opacity-95" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#11141e] via-[#11141e]/50 to-transparent"></div>
                    
                    {/* Suite Header Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-amber-300 bg-black/70 px-3 py-1 rounded-full border border-amber-500/30 backdrop-blur-md shadow-sm">
                        {cat.suiteNo}
                      </span>
                      <div className="w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-amber-300 flex items-center justify-center shadow-md group-hover:border-primary group-hover:text-primary transition-all duration-300">
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content Base */}
                  <div className="p-6 pt-1 flex flex-col flex-grow justify-between relative z-10">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1.5">
                        {cat.subBadge}
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-white mb-2 group-hover:text-amber-200 transition-colors tracking-wide">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-gray-400 mb-6 leading-relaxed font-light">
                        {cat.tagline}
                      </p>

                      {/* Brand Chips Inside this Sub-Catalog */}
                      {(() => {
                        const activeSuiteBrands = dynamicBrandPartners
                          .map(b => b.title)
                          .filter(bTitle => (products || []).some(p => matchesSubCatalog(p, cat.id) && matchesBrand(p, bTitle)));
                        const brandsToShow = activeSuiteBrands.length > 0 ? activeSuiteBrands : cat.brands;

                        return (
                          <div className="mb-6 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between mb-2.5">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                                Partner Houses
                              </span>
                              <span className="text-[10px] text-amber-300 font-semibold">
                                {brandsToShow.length} Brands
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {brandsToShow.map((bName) => (
                                <Link
                                  key={bName}
                                  to={`/shop?subcatalog=${cat.id}&brand=${encodeURIComponent(bName)}`}
                                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 hover:bg-gradient-to-r hover:from-amber-200 hover:to-primary hover:text-dark text-gray-300 border border-white/10 hover:border-transparent transition-all shadow-xs inline-flex items-center gap-1.5"
                                >
                                  <span className="shrink-0 text-amber-300">
                                    <BrandLogo brand={bName} size="xs" />
                                  </span>
                                  <span>{bName}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Luxury Gold CTA Button */}
                    <Link
                      to={`/shop?subcatalog=${cat.id}`}
                      className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-200 via-primary to-amber-500 hover:from-white hover:to-white text-dark font-bold text-xs uppercase tracking-wider text-center transition-all duration-300 flex items-center justify-between group/btn shadow-[0_4px_20px_rgba(203,152,52,0.3)] hover:shadow-[0_6px_25px_rgba(255,255,255,0.4)]"
                    >
                      <span>Explore {cat.shortCta}</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Authorized Brand Portfolios - Continuous Animated Sliding Track */}
      <section className="py-24 bg-white relative overflow-hidden">
        <style>{`
          @keyframes brandSlideTrack {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-brand-slide {
            display: flex;
            width: max-content;
            animation: brandSlideTrack 36s linear infinite;
          }
          .animate-brand-slide:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <span className="text-primary font-bold text-xs tracking-[0.25em] uppercase block mb-3">Authorized Distribution</span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-dark">Premier Brand Partners</h2>
              <div className="w-16 h-1 bg-primary mt-5"></div>
            </div>
            <p className="text-gray-500 text-sm max-w-md mt-4 md:mt-0 leading-relaxed font-light">
              Every item is guaranteed 100% genuine, backed by official warranty certificates and custom enterprise co-branding.
            </p>
          </div>
        </div>

        {/* Continuous Animated Track - Zero Side Blend Overlays, Zero Scrollbars */}
        <div className="w-full overflow-hidden">
          <div className="animate-brand-slide flex gap-6">
            {[...dynamicBrandPartners, ...dynamicBrandPartners].map((brand, idx) => {
              const matchingProducts = (products || []).filter(p => matchesBrand(p, brand.title));
              const brandCount = matchingProducts.length || brand.defaultCount;
              if (matchingProducts.length === 0 && (brand.title === "Puma" || brand.title === "Nike")) return null;

              // Extract real product image from actual imported database products
              let prodWithImg = null;
              if (brand.preferredSku) {
                prodWithImg = matchingProducts.find(p => p.sku === brand.preferredSku && p.images && p.images.length > 0);
              }
              if (!prodWithImg && brand.preferredFilter) {
                prodWithImg = matchingProducts.find(p => brand.preferredFilter(p) && p.images && p.images.length > 0);
              }
              if (!prodWithImg) {
                prodWithImg = matchingProducts.find(p => p.images && p.images.length > 0 && p.images[0]);
              }

              const realImg = prodWithImg?.images?.[0] || brand.fallbackImg || ('https://via.placeholder.com/400?text=' + encodeURIComponent(brand.title));

              return (
                <Link 
                  to={`/shop?brand=${encodeURIComponent(brand.title)}`} 
                  key={`${brand.title}-${idx}`} 
                  className="group rounded-2xl overflow-hidden bg-white border border-gray-200/90 hover:border-primary shadow-sm hover:shadow-[0_16px_36px_rgba(203,152,52,0.18)] transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col h-[340px] w-[280px] sm:w-[315px] shrink-0 select-none cursor-pointer"
                >
                  {/* Clean Canvas for REAL Product Photo */}
                  <div className="relative h-56 w-full p-4 bg-gradient-to-b from-gray-50 to-gray-100/60 flex items-center justify-center overflow-hidden">
                    <img 
                      src={realImg} 
                      alt={`${brand.title} Corporate Gifting Product`} 
                      className={`${brand.zoomClass || 'max-h-full max-w-full object-contain group-hover:scale-108'} transition-transform duration-700 drop-shadow-sm select-none pointer-events-none`} 
                      onError={(e) => { 
                        if (brand.fallbackImg && e.target.src !== brand.fallbackImg) {
                          e.target.src = brand.fallbackImg;
                        } else {
                          e.target.src = 'https://via.placeholder.com/400?text=' + encodeURIComponent(brand.title);
                        }
                      }}
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-dark bg-white/95 px-2.5 py-1 rounded-full border border-gray-200/90 shadow-xs backdrop-blur-sm">
                        <BrandLogo brand={brand.title} size="xs" />
                        <span>{brand.title}</span>
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                      <span className="text-gray-700 text-[11px] font-bold bg-white/95 px-2.5 py-1 rounded-full border border-gray-200 shadow-xs backdrop-blur-sm">
                        {brandCount} Products
                      </span>
                    </div>
                  </div>

                  {/* Executive Dark Card Base */}
                  <div className="p-5 flex-grow flex items-center justify-between bg-[#0e1117] text-white border-t border-white/10 group-hover:bg-[#141822] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 text-amber-300">
                        <BrandLogo brand={brand.title} size="md" />
                      </div>
                      <div>
                        <div className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider mb-0.5">
                          {brand.categoryNote}
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-primary transition-colors tracking-wide">
                          {brand.title}
                        </h3>
                      </div>
                    </div>
                    <span className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-primary text-white group-hover:text-dark flex items-center justify-center transition-all duration-300 shrink-0">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span>Hover on any brand card to pause and explore collections</span>
          </div>
        </div>
      </section>

      {/* 5. Separate Sliding Client Brand Logos Showcase */}
      <section className="py-24 bg-[#0d0f16] text-white overflow-hidden relative border-y border-white/10">
        <style>{`
          @keyframes clientScrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes clientScrollRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-clients-left {
            display: flex;
            width: max-content;
            animation: clientScrollLeft 38s linear infinite;
          }
          .animate-clients-right {
            display: flex;
            width: max-content;
            animation: clientScrollRight 38s linear infinite;
          }
          .animate-clients-left:hover,
          .animate-clients-right:hover {
            animation-play-state: paused;
          }
        `}</style>

        {/* Subtle Ambient light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-14 text-center">
          <span className="text-amber-300 font-bold text-xs tracking-[0.25em] uppercase block mb-3">
            ✦ Premier Corporate Relationships
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide">Our Clients</h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-5"></div>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto mt-4 font-light leading-relaxed">
            Trusted corporate gifting partner to 30+ multinational leaders, engineering conglomerates, and Fortune enterprises.
          </p>
        </div>

        {/* Sliding Tracks Container with Soft Fade Edges */}
        <div className="relative overflow-hidden space-y-6">
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#0d0f16] via-[#0d0f16]/90 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#0d0f16] via-[#0d0f16]/90 to-transparent z-20 pointer-events-none"></div>

          {/* Row 1: Sliding Left (Clients 1 to 16) */}
          <div className="animate-clients-left flex gap-5">
            {[
              { id: 1, name: "Advanta" },
              { id: 2, name: "DongYang" },
              { id: 3, name: "EFL" },
              { id: 4, name: "Sungro Seeds" },
              { id: 5, name: "Emerson" },
              { id: 6, name: "Hytech" },
              { id: 7, name: "Ishwar Parmar Group" },
              { id: 8, name: "BMB Construction" },
              { id: 9, name: "Mahyco" },
              { id: 10, name: "PolyWorks" },
              { id: 11, name: "Optra Systems" },
              { id: 12, name: "Metro Services" },
              { id: 13, name: "Evolve" },
              { id: 14, name: "H&R Block" },
              { id: 15, name: "Hager" },
              { id: 16, name: "SLB" },
              // Duplicate for seamless infinite loop
              { id: 1, name: "Advanta" },
              { id: 2, name: "DongYang" },
              { id: 3, name: "EFL" },
              { id: 4, name: "Sungro Seeds" },
              { id: 5, name: "Emerson" },
              { id: 6, name: "Hytech" },
              { id: 7, name: "Ishwar Parmar Group" },
              { id: 8, name: "BMB Construction" },
              { id: 9, name: "Mahyco" },
              { id: 10, name: "PolyWorks" },
              { id: 11, name: "Optra Systems" },
              { id: 12, name: "Metro Services" },
              { id: 13, name: "Evolve" },
              { id: 14, name: "H&R Block" },
              { id: 15, name: "Hager" },
              { id: 16, name: "SLB" },
            ].map((client, idx) => (
              <div 
                key={`r1-${client.id}-${idx}`}
                className="w-[195px] h-[86px] bg-white rounded-2xl shadow-md hover:shadow-2xl border border-white/20 hover:border-amber-400 p-3 flex flex-col items-center justify-center shrink-0 transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
                title={client.name}
              >
                <img 
                  src={`/clients/client-${client.id}.png`} 
                  alt={client.name} 
                  className="max-h-12 max-w-[155px] object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Row 2: Sliding Right (Clients 17 to 31) */}
          <div className="animate-clients-right flex gap-5">
            {[
              { id: 17, name: "Visteon" },
              { id: 18, name: "Yogesh Enterprises" },
              { id: 19, name: "Nipro" },
              { id: 20, name: "Praj Industries" },
              { id: 21, name: "Xcaliber Infotech" },
              { id: 22, name: "Amnicom" },
              { id: 23, name: "Druva" },
              { id: 24, name: "TATA Technologies" },
              { id: 25, name: "BP" },
              { id: 26, name: "POSCO Maharashtra" },
              { id: 27, name: "Paranjape Schemes" },
              { id: 28, name: "Harbinger Group" },
              { id: 29, name: "Rahi Systems" },
              { id: 30, name: "Saksham Healthcare" },
              { id: 31, name: "Smith+Nephew" },
              // Duplicate for seamless infinite loop
              { id: 17, name: "Visteon" },
              { id: 18, name: "Yogesh Enterprises" },
              { id: 19, name: "Nipro" },
              { id: 20, name: "Praj Industries" },
              { id: 21, name: "Xcaliber Infotech" },
              { id: 22, name: "Amnicom" },
              { id: 23, name: "Druva" },
              { id: 24, name: "TATA Technologies" },
              { id: 25, name: "BP" },
              { id: 26, name: "POSCO Maharashtra" },
              { id: 27, name: "Paranjape Schemes" },
              { id: 28, name: "Harbinger Group" },
              { id: 29, name: "Rahi Systems" },
              { id: 30, name: "Saksham Healthcare" },
              { id: 31, name: "Smith+Nephew" },
            ].map((client, idx) => (
              <div 
                key={`r2-${client.id}-${idx}`}
                className="w-[195px] h-[86px] bg-white rounded-2xl shadow-md hover:shadow-2xl border border-white/20 hover:border-amber-400 p-3 flex flex-col items-center justify-center shrink-0 transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
                title={client.name}
              >
                <img 
                  src={`/clients/client-${client.id}.png`} 
                  alt={client.name} 
                  className="max-h-12 max-w-[155px] object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Partner Action */}
        <div className="flex justify-center mt-14 relative z-10">
          <a 
            href="#enquire" 
            className="group flex items-center gap-3 bg-gradient-to-r from-amber-200 via-primary to-amber-500 hover:from-white hover:to-white text-dark font-bold text-xs uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 shadow-[0_4px_25px_rgba(203,152,52,0.35)] hover:-translate-y-1"
          >
            <span>Partner With Impressions For Corporate Gifting</span> 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </a>
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
