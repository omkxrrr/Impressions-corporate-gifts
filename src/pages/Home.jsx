import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { BrandLogo } from '../components/BrandLogo';
import { useProducts } from '../context/ProductContext';
import { Truck, ShieldCheck, Gift, Star, ArrowRight, Award, CheckCircle2, PhoneCall, Sparkles, Shirt, Briefcase, Activity, Layers, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { matchesBrand, detectBrand, matchesSubCatalog } from '../utils/catalogCategories';
import { getHeroBanners, DEFAULT_BANNERS } from '../services/bannerService';

const Home = () => {
  const { products } = useProducts();
  const [heroBanners, setHeroBanners] = useState(DEFAULT_BANNERS);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch live banners dynamically from cloud/localStorage (uploaded from admin panel)
  useEffect(() => {
    let isMounted = true;

    const loadLiveBanners = () => {
      getHeroBanners().then((loaded) => {
        if (isMounted && Array.isArray(loaded) && loaded.length > 0) {
          const activeOnly = loaded.filter(b => b.isActive !== false);
          setHeroBanners(activeOnly.length > 0 ? activeOnly : loaded);
        }
      });
    };

    loadLiveBanners();

    // Listen for instant updates when banners are added/changed in admin
    window.addEventListener('impressions_banners_updated', loadLiveBanners);
    window.addEventListener('storage', loadLiveBanners);

    return () => { 
      isMounted = false;
      window.removeEventListener('impressions_banners_updated', loadLiveBanners);
      window.removeEventListener('storage', loadLiveBanners);
    };
  }, []);

  // Auto-play timer for hero banner slider (rotates every 6 seconds)
  useEffect(() => {
    if (isPaused || heroBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, heroBanners.length]);

  const activeBanner = (heroBanners && heroBanners[currentSlide]) 
    || (heroBanners && heroBanners[0]) 
    || DEFAULT_BANNERS[0] 
    || {};

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  // Dynamic brand partners for the marquee slider (STRICTLY only brands added in store)
  const activeStoreBrands = useMemo(() => {
    const BRAND_METADATA = {
      'Puma': {
        categoryNote: 'Activewear & Athleisure',
        defaultCount: 30
      },
      'Adidas': {
        categoryNote: 'Sports Tech & Trackwear',
        defaultCount: 56
      },
      'Reebok': {
        categoryNote: 'Performance Polos & Athletic Jackets',
        defaultCount: 33
      },
      'Scott International': {
        categoryNote: 'Premium Tipped Polos & Bio-Wash Tees',
        defaultCount: 27
      },
      'Rare Rabbit': {
        categoryNote: 'Designer Polos & Formal Shirts',
        defaultCount: 33
      },
      'Jack & Jones': {
        categoryNote: 'Polos, Tees & Jackets',
        defaultCount: 42
      },
      'Monte Carlo': {
        categoryNote: 'Oxford Shirts & Knitwear',
        defaultCount: 38
      },
      'French Connection': {
        categoryNote: 'Premium Shirts & Polos',
        defaultCount: 28
      },
      'UCB (Benetton)': {
        categoryNote: 'Polo T-Shirts & Casuals',
        defaultCount: 16
      },
      'Arrow': {
        categoryNote: 'Executive Formal Wear',
        defaultCount: 14
      }
    };

    // Canonical order for user's verified store brands
    const KNOWN_STORE_ORDER = [
      'Puma',
      'Adidas',
      'Reebok',
      'Scott International',
      'Rare Rabbit',
      'Jack & Jones',
      'Monte Carlo',
      'French Connection',
      'UCB (Benetton)',
      'Arrow'
    ];

    // Count products per brand dynamically from store catalog
    const brandCounts = new Map();
    (products || []).forEach(p => {
      const b = detectBrand(p);
      if (b && b !== 'Unbranded' && b !== 'Corporate Collection') {
        brandCounts.set(b, (brandCounts.get(b) || 0) + 1);
      }
    });

    let detectedBrandNames = [];

    if (brandCounts.size > 0) {
      // 1. Include only known brands that have genuine products in store (count > 0)
      const activeKnown = KNOWN_STORE_ORDER.filter(bName => {
        const count = brandCounts.get(bName) || (products || []).filter(p => matchesBrand(p, bName)).length;
        return count > 0;
      });

      // 2. Discover any newly added brands in database (excluding non-brands)
      const additional = Array.from(brandCounts.keys()).filter(bName =>
        !KNOWN_STORE_ORDER.includes(bName) && (brandCounts.get(bName) || 0) > 0
      );

      detectedBrandNames = [...activeKnown, ...additional];
    } else {
      // Initial render fallback before fetch settles - ONLY the user's 10 real brands
      detectedBrandNames = KNOWN_STORE_ORDER;
    }

    return detectedBrandNames.map(title => {
      const meta = BRAND_METADATA[title] || {};
      const actualCount = brandCounts.get(title) || (products || []).filter(p => matchesBrand(p, title)).length;
      return {
        title,
        categoryNote: meta.categoryNote || 'Official Corporate Partner',
        count: actualCount || meta.defaultCount || 20
      };
    });
  }, [products]);

  // Brand Partners Rows for Animated Sliding Marquee (Splits user's active brands evenly)
  const { row1Brands, row2Brands } = useMemo(() => {
    if (!activeStoreBrands.length) return { row1Brands: [], row2Brands: [] };
    const half = Math.ceil(activeStoreBrands.length / 2);
    return {
      row1Brands: activeStoreBrands.slice(0, half),
      row2Brands: activeStoreBrands.slice(half)
    };
  }, [activeStoreBrands]);

  return (
    <div className="flex flex-col font-sans bg-white selection:bg-primary selection:text-dark">
      
      {/* 1. Hero Banner - Dual Mode: Ultra-HD Graphic Banner OR Editorial Typography Showcase */}
      {activeBanner?.bannerImg ? (
        <section 
          className="relative w-full bg-[#0a0a0a] overflow-hidden select-none border-b border-amber-900/30"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Full-Bleed Graphic Banner - 100% Crisp Native Resolution with Zero Darkening Overlay */}
          <Link to={activeBanner?.ctaLink || '/shop'} className="block relative w-full group cursor-pointer">
            <img 
              src={activeBanner.bannerImg} 
              alt={activeBanner?.titlePrefix || "Festive Corporate Banner"} 
              className="w-full h-auto block object-contain sm:object-cover sm:min-h-[460px] max-h-[700px] object-center transition-transform duration-700 group-hover:scale-[1.004]"
              style={{ 
                imageRendering: '-webkit-optimize-contrast',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
              loading="eager"
              fetchPriority="high"
            />

            {/* Desktop Floating Action Pill Bar on the Bottom-Right Corner */}
            <div className="hidden sm:flex absolute bottom-4 sm:bottom-6 right-4 sm:right-8 items-center gap-3 z-20">
              <span className="px-5 py-2.5 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xl border border-white/20 transition-all">
                <span>{activeBanner.ctaText || 'Explore Catalog'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </span>
              <a 
                href="#enquire" 
                onClick={(e) => e.stopPropagation()}
                className="px-5 py-2.5 rounded-full bg-[#942024] hover:bg-[#7a181c] text-white text-xs font-bold uppercase tracking-wider shadow-2xl border border-white/20 transition-all cursor-pointer"
              >
                Request Quote
              </a>
            </div>
          </Link>

          {/* Mobile Quick Action Buttons - Below the Banner (Zero overlap on Canva graphic) */}
          <div className="flex sm:hidden items-center gap-2.5 p-3 bg-[#0d0d0d] border-t border-white/10">
            <Link 
              to={activeBanner?.ctaLink || '/shop'} 
              className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 rounded-lg border border-white/15 transition-colors"
            >
              Explore Catalog →
            </Link>
            <a 
              href="#enquire" 
              className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white bg-[#942024] hover:bg-[#7d191d] rounded-lg shadow-md transition-colors"
            >
              Request Quote
            </a>
          </div>

          {/* Desktop Floating Slider Controls on the Bottom-Left */}
          {heroBanners.length > 1 && (
            <div className="hidden sm:flex absolute bottom-4 sm:bottom-6 left-4 sm:left-8 items-center gap-2.5 z-20 bg-black/55 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-xl">
              <button
                type="button"
                onClick={prevSlide}
                className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
                title="Previous Slide"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1.5">
                {heroBanners.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx ? 'w-5 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={nextSlide}
                className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
                title="Next Slide"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-white/80 font-mono tracking-wider ml-1 select-none">
                0{currentSlide + 1} / 0{heroBanners.length}
              </span>
            </div>
          )}

          {/* Mobile Dot Indicators */}
          {heroBanners.length > 1 && (
            <div className="flex sm:hidden justify-center items-center gap-1.5 py-2 bg-[#0d0d0d] border-t border-white/5">
              {heroBanners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx ? 'w-5 bg-amber-400' : 'w-2 bg-white/30'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <section 
          className="relative min-h-[580px] lg:min-h-[660px] flex items-center overflow-hidden bg-gray-900"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Ambient Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop" 
              alt="Corporate Gifting" 
              className="w-full h-full object-cover object-center scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex items-center">
            <div className="max-w-2xl w-full text-white">
              
              <div className="flex items-center gap-2 mb-4">
                <span className="w-0.5 h-4 bg-white inline-block"></span>
                <span className="text-white/90 text-xs sm:text-sm font-semibold uppercase tracking-widest">
                  FOR CORPORATES &amp; ENTERPRISES
                </span>
              </div>

              <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12] mb-4">
                {activeBanner?.pillType === 'festive' ? (
                  <>
                    Diwali &amp; Corporate Gifts <br className="hidden sm:inline" />
                    <span className="italic font-serif font-light text-amber-200">For Your Business</span>
                  </>
                ) : (
                  <>
                    Corporate Gifting <br className="hidden sm:inline" />
                    <span className="italic font-serif font-light text-amber-200">For Your Team &amp; Clients</span>
                  </>
                )}
              </h1>
              
              <p className="text-white/90 text-sm sm:text-lg leading-relaxed max-w-xl mb-8 font-light">
                Premium custom branded hampers &amp; corporate merchandise delivered pan-India.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <a 
                  href="#enquire" 
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide text-white bg-[#942024] hover:bg-[#7d191d] transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  Request a Quote
                </a>
                <a 
                  href="https://wa.me/917620872092?text=Hello%20Impressions%20Team,%20I%20would%20like%20to%20enquire%20about%20corporate%20gifting%20catalog%20and%20pricing." 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide text-white bg-[#1a4441] hover:bg-[#123330] transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-300" />
                  <span>WhatsApp Us</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-white/85 font-medium pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>100% Quality Assurance</span>
                </span>
                <span className="text-white/40">•</span>
                <span className="flex items-center gap-1.5">
                  <span>Delivery within 2-4 days</span>
                </span>
                <span className="text-white/40 hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <span>Custom Logo Branding</span>
                </span>
              </div>

              {heroBanners.length > 1 && (
                <div className="flex items-center gap-3 mt-8 pt-4 border-t border-white/15 max-w-sm">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={prevSlide}
                      className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
                      title="Previous Slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
                      title="Next Slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {heroBanners.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          currentSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-white/70 font-mono tracking-wider ml-1">
                    0{currentSlide + 1} / 0{heroBanners.length}
                  </span>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* 2. Executive Corporate Trust Stats Bar - Sleek 3-Column Ribbon on Mobile & Desktop */}
      <section className="bg-[#942024] text-white py-3 sm:py-6 border-b border-[#7a181c]">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-white/20 text-center">
            
            <div className="px-1 sm:px-4">
              <div className="text-base sm:text-3xl lg:text-4xl font-extrabold tracking-tight">4,000+</div>
              <div className="text-[10px] sm:text-sm text-white/85 font-light leading-tight mt-0.5 sm:mt-1">
                Pin Codes Served
              </div>
            </div>

            <div className="px-1 sm:px-4">
              <div className="text-base sm:text-3xl lg:text-4xl font-extrabold tracking-tight">500+</div>
              <div className="text-[10px] sm:text-sm text-white/85 font-light leading-tight mt-0.5 sm:mt-1">
                Corporate Brands
              </div>
            </div>

            <div className="px-1 sm:px-4">
              <div className="text-base sm:text-3xl lg:text-4xl font-extrabold tracking-tight">50,000+</div>
              <div className="text-[10px] sm:text-sm text-white/85 font-light leading-tight mt-0.5 sm:mt-1">
                Gifts Delivered
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* 3. Premier Brand Partners - Continuous Animated Sliding Track */}
      <section className="py-20 bg-gradient-to-b from-[#fdfbf7] via-[#faf8f5] to-white relative overflow-hidden border-b border-amber-200/50">
        <style>{`
          @keyframes brandScrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes brandScrollRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-brand-track-left {
            display: flex;
            width: max-content;
            animation: brandScrollLeft 34s linear infinite;
          }
          .animate-brand-track-right {
            display: flex;
            width: max-content;
            animation: brandScrollRight 34s linear infinite;
          }
          .animate-brand-track-left:hover,
          .animate-brand-track-right:hover {
            animation-play-state: paused;
          }
        `}</style>

        {/* Subtle Ambient Golden Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-200/20 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-900 font-bold tracking-[0.25em] uppercase text-xs mb-4 backdrop-blur-md shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Authorized Corporate Distribution</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gray-950 tracking-tight">
            Premier Brand <span className="bg-gradient-to-r from-amber-700 via-primary to-amber-600 bg-clip-text text-transparent italic">Partners</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-primary mx-auto mt-5 rounded-full"></div>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mt-4 font-light leading-relaxed">
            Click on any brand logo to explore official merchandise, custom corporate branding & volume tariff cards.
          </p>
        </div>

        {/* Sliding Tracks with Soft Gradient Fade on Edges */}
        <div className="relative overflow-hidden space-y-5">
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-r from-[#fdfbf7] via-[#fdfbf7]/90 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-l from-[#fdfbf7] via-[#fdfbf7]/90 to-transparent z-20 pointer-events-none"></div>

          {/* Row 1: Sliding Left (User Added Brands - Set 1) */}
          <div className="animate-brand-track-left flex gap-5">
            {[...row1Brands, ...row1Brands, ...row1Brands, ...row1Brands].map((brand, idx) => (
              <Link
                key={`b1-${brand.title}-${idx}`}
                to={`/shop?brand=${encodeURIComponent(brand.title)}`}
                className="group w-[230px] sm:w-[260px] h-[100px] bg-white rounded-2xl border border-gray-200/90 hover:border-amber-400 shadow-sm hover:shadow-[0_12px_28px_rgba(203,152,52,0.18)] p-4 flex items-center justify-between shrink-0 transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none"
                title={`View ${brand.title} Products`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#faf8f5] group-hover:bg-amber-50/80 border border-amber-200/60 flex items-center justify-center text-gray-900 group-hover:text-primary transition-colors shrink-0 shadow-2xs">
                    <BrandLogo brand={brand.title} size="lg" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-gray-900 group-hover:text-primary transition-colors tracking-wide leading-tight">
                      {brand.title}
                    </h3>
                    <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 inline-block mt-1">
                      {brand.count} Products
                    </span>
                  </div>
                </div>
                <span className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-primary text-gray-400 group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0 shadow-2xs">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>

          {/* Row 2: Sliding Right (User Added Brands - Set 2) */}
          <div className="animate-brand-track-right flex gap-5">
            {[...row2Brands, ...row2Brands, ...row2Brands, ...row2Brands].map((brand, idx) => (
              <Link
                key={`b2-${brand.title}-${idx}`}
                to={`/shop?brand=${encodeURIComponent(brand.title)}`}
                className="group w-[230px] sm:w-[260px] h-[100px] bg-white rounded-2xl border border-gray-200/90 hover:border-amber-400 shadow-sm hover:shadow-[0_12px_28px_rgba(203,152,52,0.18)] p-4 flex items-center justify-between shrink-0 transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none"
                title={`View ${brand.title} Products`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#faf8f5] group-hover:bg-amber-50/80 border border-amber-200/60 flex items-center justify-center text-gray-900 group-hover:text-primary transition-colors shrink-0 shadow-2xs">
                    <BrandLogo brand={brand.title} size="lg" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-gray-900 group-hover:text-primary transition-colors tracking-wide leading-tight">
                      {brand.title}
                    </h3>
                    <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 inline-block mt-1">
                      {brand.count} Products
                    </span>
                  </div>
                </div>
                <span className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-primary text-gray-400 group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0 shadow-2xs">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span>Click any brand logo to view all official corporate styles & volume pricing</span>
          </div>
        </div>
      </section>

      {/* 5. Separate Sliding Client Brand Logos Showcase */}
      <section className="py-24 bg-gradient-to-b from-[#f9f7f2] via-[#fbf9f5] to-white text-gray-900 overflow-hidden relative border-y border-amber-200/50">
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-200/25 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-14 text-center">
          <span className="text-amber-800 font-bold text-xs tracking-[0.25em] uppercase block mb-3">
            ✦ Premier Corporate Relationships
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gray-950 tracking-wide">Our Clients</h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-5 rounded-full"></div>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto mt-4 font-light leading-relaxed">
            Trusted corporate gifting partner to 30+ multinational leaders, engineering conglomerates, and Fortune enterprises.
          </p>
        </div>

        {/* Sliding Tracks Container with Soft Fade Edges */}
        <div className="relative overflow-hidden space-y-6">
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#f9f7f2] via-[#f9f7f2]/90 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#f9f7f2] via-[#f9f7f2]/90 to-transparent z-20 pointer-events-none"></div>

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
                className="w-[195px] h-[86px] bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200/90 hover:border-amber-400 p-3 flex flex-col items-center justify-center shrink-0 transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
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
                className="w-[195px] h-[86px] bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200/90 hover:border-amber-400 p-3 flex flex-col items-center justify-center shrink-0 transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
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
            className="group flex items-center gap-3 bg-gradient-to-r from-amber-500 via-primary to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 shadow-[0_6px_25px_rgba(203,152,52,0.35)] hover:-translate-y-1"
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
            <span className="text-amber-800 font-bold text-xs tracking-[0.25em] uppercase block mb-3">The Concierge Standard</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gray-950">The Impressions Advantage</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-5 rounded-full"></div>
            <p className="text-gray-600 max-w-xl mx-auto mt-4 text-sm leading-relaxed">
              Elevating corporate gifting from transactional orders into high-touch relationship management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            
            <div className="p-8 rounded-2xl bg-[#faf8f5] border border-amber-200/70 hover:border-amber-400 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-amber-100/80 border border-amber-200/80 text-amber-800 group-hover:bg-primary group-hover:text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                <Gift className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">Precision Co-Branding</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Precision UV printing, debossing, hot-foil stamping, and laser engraving matching exact pantone guidelines.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#faf8f5] border border-amber-200/70 hover:border-amber-400 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-amber-100/80 border border-amber-200/80 text-amber-800 group-hover:bg-primary group-hover:text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">Guaranteed Provenance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Authorized corporate distribution ensuring 100% genuine products with manufacturer warranty certificates.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#faf8f5] border border-amber-200/70 hover:border-amber-400 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-amber-100/80 border border-amber-200/80 text-amber-800 group-hover:bg-primary group-hover:text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">Bespoke Unboxing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Rigid magnetic-closure presentation cases, custom satin ribbon pulls, and personalized wax-sealed greeting cards.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#faf8f5] border border-amber-200/70 hover:border-amber-400 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-amber-100/80 border border-amber-200/80 text-amber-800 group-hover:bg-primary group-hover:text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">White-Glove Logistics</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Individual address dropshipping directly to CXO homes or bulk consolidated dispatch to corporate headquarters.
              </p>
            </div>

          </div>

          {/* VIP Direct Concierge Banner - Warm Luxury Light Aesthetic */}
          <div className="rounded-2xl p-8 sm:p-12 bg-gradient-to-r from-[#fcf9f2] via-[#f7f2e5] to-[#f4ede0] text-gray-900 flex flex-col md:flex-row items-center justify-between gap-8 border border-amber-300/80 shadow-[0_16px_40px_rgba(203,152,52,0.12)]">
            <div className="max-w-xl">
              <span className="text-amber-800 font-bold text-xs uppercase tracking-widest block mb-2">Dedicated B2B Desk</span>
              <h4 className="font-serif text-2xl sm:text-3xl font-bold text-gray-950 mb-2">Planning an Annual Summit or Executive Retreat?</h4>
              <p className="text-gray-600 text-sm">
                Speak directly with our senior corporate gifting consultant for bespoke curation, mockups, and priority SLAs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <a 
                href="https://wa.me/917620872092?text=Hello%20Impressions%20Team,%20I%20have%20an%20urgent%20corporate%20summit%20gifting%20requirement." 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-bold text-xs uppercase tracking-wider text-white transition-colors shadow-md"
              >
                <span>WhatsApp Consultant</span>
              </a>
              <a 
                href="tel:+917620872092"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-white hover:bg-amber-50/80 border border-amber-300 font-bold text-xs uppercase tracking-wider text-gray-800 transition-colors shadow-xs"
              >
                <span>Call +91 76208 72092</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 8. Curate Your Perfect Corporate Gift - Dedicated Executive RFQ Section */}
      <section className="py-20 bg-gradient-to-b from-[#fdfbf7] via-[#f7f2e7] to-[#ede3d1] border-t border-amber-200/80 text-gray-900" id="enquire">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-widest mb-3">
              Executive B2B Procurement Desk
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gray-950 tracking-tight">
              Curate Your Perfect Corporate Gift
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
              Fill out the requisition form below. Our senior gifting consultants will share custom branding mockups, sample boxes, and volume rate cards within 2 business hours.
            </p>
            <div className="mt-3 text-sm text-gray-700 font-medium">
              <span>Direct Phone Support: </span>
              <a href="tel:+917620872092" className="font-bold text-[#942024] hover:underline">
                +91 76208 72092
              </a>
              <span className="mx-2 text-gray-400">|</span>
              <a 
                href="https://wa.me/917620872092?text=Hello%20Impressions%20Team,%20I%20have%20an%20urgent%20corporate%20gifting%20requirement." 
                target="_blank" 
                rel="noreferrer" 
                className="font-bold text-emerald-700 hover:underline"
              >
                Instant WhatsApp Desk
              </a>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(203,152,52,0.18)] border border-amber-200 p-8 sm:p-12">
            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                const fd = new FormData(e.target);
                const name = fd.get('name') || '';
                const company = fd.get('company') || '';
                const email = fd.get('email') || '';
                const phone = fd.get('phone') || '';
                const quantity = fd.get('quantity') || 'Not specified';
                const topic = activeBanner?.enquiryTopic || 'Corporate & Festive Gifting';
                const message = encodeURIComponent(
                  `Hello Impressions Executive Team,\n\nI would like to curate corporate gifts:\n\n• Full Name: ${name}\n• Organization: ${company}\n• Work Email: ${email}\n• Contact: +91 ${phone}\n• Quantity Required: ${quantity}\n• Requirement: ${topic}\n\nPlease share your curated corporate catalog, mockups, and volume pricing.`
                );
                window.open(`https://wa.me/917620872092?text=${message}`, '_blank');
              }} 
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-gray-700 mb-2">
                    Executive Full Name *
                  </label>
                  <input 
                    name="name" 
                    required 
                    type="text" 
                    placeholder="e.g. Rahul Sharma" 
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#942024] focus:bg-white text-gray-900 text-sm placeholder-gray-400 transition-colors shadow-2xs" 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-gray-700 mb-2">
                    Company / Enterprise *
                  </label>
                  <input 
                    name="company" 
                    required 
                    type="text" 
                    placeholder="e.g. Deloitte India / Tata Steel" 
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#942024] focus:bg-white text-gray-900 text-sm placeholder-gray-400 transition-colors shadow-2xs" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-gray-700 mb-2">
                    Work Email *
                  </label>
                  <input 
                    name="email" 
                    required 
                    type="email" 
                    placeholder="name@company.com" 
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#942024] focus:bg-white text-gray-900 text-sm placeholder-gray-400 transition-colors shadow-2xs" 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-gray-700 mb-2">
                    Contact Phone Number *
                  </label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#942024] focus-within:bg-white transition-colors">
                    <span className="px-3.5 text-xs font-bold text-gray-600 border-r border-gray-200 select-none">
                      IN 🇮🇳 +91
                    </span>
                    <input 
                      name="phone" 
                      required 
                      type="tel" 
                      placeholder="98765 43210" 
                      className="flex-1 px-4 py-3.5 bg-transparent focus:outline-none text-gray-900 text-sm placeholder-gray-400" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-gray-700 mb-2">
                  Estimated Gift Quantity *
                </label>
                <select 
                  name="quantity" 
                  required 
                  defaultValue="" 
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#942024] focus:bg-white text-gray-900 text-sm transition-colors cursor-pointer" 
                >
                  <option value="" disabled>Select Quantity Range Required</option>
                  <option value="25 - 50 Units">25 - 50 Units (Boutique Executive Suite)</option>
                  <option value="50 - 200 Units">50 - 200 Units (Mid-tier Corporate Curation)</option>
                  <option value="200 - 500 Units">200 - 500 Units (Large Scale Festive Program)</option>
                  <option value="500+ Units (Enterprise Bulk)">500+ Units (Pan-India Enterprise Delivery)</option>
                </select>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full bg-[#942024] hover:bg-[#7a181c] text-white font-bold text-sm py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer tracking-widest uppercase flex items-center justify-center gap-2"
                >
                  <span>Submit Executive Quotation Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="text-xs font-semibold text-gray-800">100% Genuine Brands</span>
                  <span className="text-[11px] text-gray-500">Authorized Distribution</span>
                </div>
                <div className="flex flex-col items-center">
                  <Sparkles className="w-5 h-5 text-amber-600 mb-1" />
                  <span className="text-xs font-semibold text-gray-800">Free Digital Mockups</span>
                  <span className="text-[11px] text-gray-500">Within 2 Business Hours</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="w-5 h-5 text-amber-600 mb-1" />
                  <span className="text-xs font-semibold text-gray-800">Pan-India Dispatch</span>
                  <span className="text-[11px] text-gray-500">Consolidated or Individual</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="text-xs font-semibold text-gray-800">GST Input Credit</span>
                  <span className="text-[11px] text-gray-500">Full Compliance Invoicing</span>
                </div>
              </div>

            </form>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
