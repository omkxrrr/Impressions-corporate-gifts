import { Link } from 'react-router-dom';
import { 
  Award, 
  Palette, 
  ShieldCheck, 
  Clock, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Building2, 
  Truck, 
  PhoneCall 
} from 'lucide-react';

const About = () => {
  const roadmapSteps = [
    {
      step: '01',
      title: 'Wide range of premium corporate products',
      tagline: 'Comprehensive B2B Catalog',
      desc: 'An exhaustive portfolio spanning official apparel (Jack & Jones, Arrow, Monte Carlo, Adidas), high-performance tech, luxury drinkware, bespoke leatherware, and corporate office essentials.',
      Icon: Layers,
      highlight: '400+ Active Styles'
    },
    {
      step: '02',
      title: 'Complete branding and customization solutions',
      tagline: 'End-to-End Identity Placement',
      desc: 'Precision laser engraving, computerized textile embroidery, debossing, full-color UV printing, and custom rigid presentation packaging crafted to highlight your corporate identity.',
      Icon: Palette,
      highlight: 'Tailored Packaging'
    },
    {
      step: '03',
      title: 'Trusted brands with assured quality',
      tagline: '100% Guaranteed Authenticity',
      desc: 'Direct tie-ups with India’s most prestigious consumer and fashion brands. Every product is backed by manufacturer warranties and rigorous multi-stage quality inspections.',
      Icon: ShieldCheck,
      highlight: 'Verified Partners'
    },
    {
      step: '04',
      title: 'Competitive pricing and timely delivery',
      tagline: 'Supply Chain Efficiency',
      desc: 'Factory-direct wholesale economics ensuring unmatched cost-performance for bulk volumes, combined with expedited pan-India logistics for strict deadline adherence.',
      Icon: Clock,
      highlight: 'Zero-Delay Commitment'
    },
    {
      step: '05',
      title: 'Tailored solutions for businesses of every size',
      tagline: 'Scalable Enterprise Gifting',
      desc: 'Whether you require 25 VIP executive boardroom hampers or 10,000 pan-India employee onboarding kits, our concierge delivers bespoke programs custom-fit to your exact budget.',
      Icon: Briefcase,
      highlight: 'Flexible Scaling'
    }
  ];

  return (
    <div className="bg-[#090b10] text-white min-h-screen font-sans selection:bg-primary selection:text-dark">
      
      {/* 1. Executive Hero Header */}
      <section className="relative py-24 sm:py-32 overflow-hidden border-b border-white/10 bg-[#0c0e15]">
        {/* Ambient Gold Radial Glows */}
        <div className="absolute top-0 left-1/3 w-[650px] h-[650px] bg-primary/10 rounded-full blur-[170px] pointer-events-none"></div>
        <div className="absolute -bottom-20 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-amber-300 font-bold tracking-[0.25em] uppercase text-xs mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Impressions Corporate Gifts | Enterprise Concierge</span>
          </div>
          
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Architecting Impactful <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-200 via-primary to-amber-500 bg-clip-text text-transparent italic">
              Corporate Brand Identity
            </span>
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-amber-300 to-primary mx-auto my-7 rounded-full"></div>

          <p className="text-gray-300 text-base sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Your trusted strategic partner for premium corporate gifting, customized branding, promotional merchandise, and business essentials across India.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-14 pt-10 border-t border-white/10">
            <div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-amber-300">100K+</div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">Corporate Gifts Curated</div>
            </div>
            <div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-amber-300">30+</div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">Fortune Enterprise Clients</div>
            </div>
            <div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-amber-300">100%</div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">Authorized Brand Warranty</div>
            </div>
            <div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-amber-300">Pan-India</div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">Direct Doorstep Dispatch</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT US — Official Narrative & Merchandising Showcase */}
      <section className="py-24 sm:py-32 bg-white text-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left: Luxury Editorial Merchandising Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative space-y-5">
                {/* Image 1: Executive Corporate Essentials Kit */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 group">
                  <img 
                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop" 
                    alt="Impressions Corporate Gifts Luxury Kit" 
                    className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent flex items-end p-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300 bg-black/60 px-3 py-1 rounded-full border border-amber-400/30 backdrop-blur-sm">
                        Curated Merchandise Kit
                      </span>
                      <p className="text-white text-xs mt-1 font-medium">Bespoke flasks, leather journals, pens & tech gear</p>
                    </div>
                  </div>
                </div>

                {/* Image 2: Executive Branded Apparel & Swag */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 group">
                  <img 
                    src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop" 
                    alt="Corporate Apparel & Bags" 
                    className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent flex items-end p-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300 bg-black/60 px-3 py-1 rounded-full border border-amber-400/30 backdrop-blur-sm">
                        Executive Apparel & Headwear
                      </span>
                      <p className="text-white text-xs mt-1 font-medium">Embroidered polos, corporate caps & tote bags</p>
                    </div>
                  </div>
                </div>

                {/* Floating Authentic Quality Seal */}
                <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-dark text-white p-5 rounded-2xl shadow-2xl border-2 border-primary/60 max-w-[220px] backdrop-blur-md hidden sm:block">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-xs font-bold text-amber-200 leading-tight">Verified Enterprise Quality</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-snug">
                    Zero compromise on fabrication, print fidelity, and presentation.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: The Exact Brochure About Us Copy & Pillars */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.25em] mb-4">
                <span className="w-8 h-1 bg-primary rounded-full"></span>
                <span>ABOUT US</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Strengthening Brand Identity Through Distinctive Corporate Essentials
              </h2>

              {/* Exact Brochure Narrative */}
              <div className="relative pl-6 border-l-4 border-primary/80 mb-8 bg-amber-50/50 p-6 rounded-r-2xl">
                <p className="text-gray-800 text-base sm:text-lg leading-relaxed font-normal">
                  "At <strong className="text-gray-950 font-semibold">Impressions Corporate Gifts</strong>, we provide premium corporate gifting, customized branding, promotional merchandise and business essentials that help organizations strengthen their brand identity. With a wide range of quality products, reliable customization, competitive pricing and timely delivery, we are your trusted partner for impactful corporate gifting solutions."
                </p>
              </div>

              {/* 4 Core Pillars from the Brochure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Premium Products & Essentials</h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Curated executive merchandise that conveys gratitude and commands lasting boardroom respect.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Reliable Customization</h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Precision laser engraving, embroidery, and custom gift boxes aligned with strict corporate guidelines.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Competitive B2B Pricing</h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Direct-tier enterprise volume pricing providing maximum budget optimization for procurement heads.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Timely Pan-India Delivery</h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Strict deadline governance with multi-location centralized or home delivery tracking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US — The 5-Step Value Progression Roadmap */}
      <section className="py-28 bg-[#090b10] text-white relative overflow-hidden border-t border-white/10">
        {/* Ambient Radial Lights */}
        <div className="absolute top-1/4 right-10 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.25em] mb-4">
              <span className="w-8 h-0.5 bg-primary"></span>
              <span>WHY CHOOSE US</span>
              <span className="w-8 h-0.5 bg-primary"></span>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Our 5-Pillar <span className="bg-gradient-to-r from-amber-200 via-primary to-amber-500 bg-clip-text text-transparent italic">Value Elevation Framework</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-300 to-primary mx-auto mt-5 rounded-full"></div>
            
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mt-4 font-light leading-relaxed">
              Every corporate partnership is backed by our proven 5-step operational model, guaranteeing unmatched excellence from concept to final handshake.
            </p>
          </div>

          {/* Upward Rising 5-Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
            {roadmapSteps.map((item, index) => {
              const StepIcon = item.Icon;
              // Visual step elevation effect to match the upward trajectory in the brochure
              const elevationStyles = [
                'lg:translate-y-8',   // 01
                'lg:translate-y-4',   // 02
                'lg:translate-y-0',   // 03
                'lg:-translate-y-4',  // 04
                'lg:-translate-y-8'   // 05 (highest)
              ];

              return (
                <div 
                  key={item.step}
                  className={`group relative rounded-2xl bg-[#11141e] border border-white/10 hover:border-primary/80 p-6 flex flex-col justify-between transition-all duration-500 shadow-[0_12px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(203,152,52,0.25)] hover:-translate-y-3 ${elevationStyles[index]}`}
                >
                  {/* Glowing Top Ambient Pill */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-2xl font-black text-amber-300/80 group-hover:text-amber-200 transition-colors">
                      {item.step}
                    </span>
                    
                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/15 text-amber-300 flex items-center justify-center shadow-md group-hover:bg-gradient-to-r group-hover:from-amber-200 group-hover:to-primary group-hover:text-dark transition-all duration-300">
                      <StepIcon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary block mb-2">
                      {item.tagline}
                    </span>

                    <h3 className="font-bold text-white text-base leading-snug mb-3 group-hover:text-amber-200 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-gray-400 text-xs leading-relaxed font-light mb-6">
                      {item.desc}
                    </p>
                  </div>

                  {/* Bottom Highlight Badge */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      <span>{item.highlight}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upward Progression Trajectory Banner */}
          <div className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-white/5 via-primary/10 to-white/5 border border-white/15 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-white">
                  Trusted by Over 30+ Multinational Conglomerates
                </h4>
                <p className="text-gray-400 text-xs mt-0.5">
                  Deloitte, Emerson, PolyWorks, Mahyco, Advanta, DongYang, H&R Block, and leading Indian enterprises.
                </p>
              </div>
            </div>

            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-200 via-primary to-amber-500 hover:from-white hover:to-white text-dark font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg shrink-0"
            >
              <span>Explore Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. Executive Call-To-Action Desk */}
      <section className="py-24 bg-white text-gray-900 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.25em] block mb-3">
            Direct Concierge Desk
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gray-950 mb-6">
            Ready to Elevate Your Corporate Gifting Program?
          </h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Contact our senior merchandising specialists to receive virtual mockups, custom volume tariffs, and physical sample boxes for your executive committee.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a 
              href="/#enquire" 
              className="bg-dark hover:bg-primary text-white hover:text-dark px-9 py-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center gap-2"
            >
              <span>Request Instant Bulk Proposal</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a 
              href="https://wa.me/917620872092?text=Hello%20Impressions%20Team,%20we%20are%20looking%20for%20corporate%20gifting%20and%20customized%20merchandise%20solutions." 
              target="_blank" 
              rel="noreferrer"
              className="border-2 border-dark/20 hover:border-dark text-dark px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-primary" />
              <span>Connect on WhatsApp Desk</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
