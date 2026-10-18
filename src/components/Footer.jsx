import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Phone, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0b0d13] text-gray-300 border-t-2 border-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Executive Newsletter & Catalog Download Bar */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 mb-16 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-1">Stay Ahead in Corporate Gifting</span>
            <h4 className="font-serif text-2xl font-bold text-white mb-2">Receive the 2026-2027 Executive Lookbook</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Subscribe to access unreleased corporate hampers, new international brand arrivals, and seasonal volume tariff cards.
            </p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); alert("Thank you! Our corporate lookbook has been dispatched to your email."); }} className="flex w-full lg:w-auto max-w-md gap-2">
            <input 
              type="email" 
              required 
              placeholder="Enter corporate email address" 
              className="bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary flex-grow transition-colors"
            />
            <button 
              type="submit" 
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-200 via-primary to-amber-500 hover:from-white hover:to-white text-dark font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md shrink-0"
            >
              Get Lookbook
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="inline-block mb-4">
              <img src="/logo.png" alt="Impressions Logo" className="h-20 w-auto object-contain scale-[1.25] origin-left" />
            </Link>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              India's premier B2B corporate gifting concierge. Crafting bespoke executive hampers, authorized luxury merchandise, and white-glove corporate deliveries.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-primary font-semibold">
                <Phone className="w-3.5 h-3.5" />
                <a href="tel:+917620872092" className="hover:text-white transition">+91 76208 72092</a>
              </div>
              <div className="flex items-center space-x-2 text-green-400 font-semibold">
                <MessageCircle className="w-3.5 h-3.5" />
                <a href="https://wa.me/917620872092?text=Hello%20Impressions%20Team,%20I%20have%20an%20enquiry%20regarding%20corporate%20gifting." target="_blank" rel="noreferrer" className="hover:text-white transition">Direct WhatsApp Desk</a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-serif font-bold text-base mb-5 tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Corporate Portfolios
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/shop?search=Jack%20Jones" className="hover:text-primary transition">Jack & Jones Executive Wear</Link></li>
              <li><Link to="/shop?search=Monte%20Carlo" className="hover:text-primary transition">Monte Carlo Formal Suites</Link></li>
              <li><Link to="/shop?search=French%20Connection" className="hover:text-primary transition">French Connection Keepsakes</Link></li>
              <li><Link to="/shop?search=Adidas" className="hover:text-primary transition">Adidas Active & Wellness</Link></li>
              <li><Link to="/shop?search=Arrow" className="hover:text-primary transition">Arrow Business Attire</Link></li>
              <li><Link to="/shop" className="hover:text-primary transition">Full Corporate Catalog (400+)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-serif font-bold text-base mb-5 tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Concierge Services
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><span className="text-gray-300 font-medium">Bespoke Laser & Deboss Branding</span></li>
              <li><span className="text-gray-300 font-medium">Multi-City Direct Home Dispatch</span></li>
              <li><span className="text-gray-300 font-medium">Custom Rigid Presentation Boxes</span></li>
              <li><span className="text-gray-300 font-medium">100% Tax Compliant B2B GST Invoicing</span></li>
              <li><Link to="/contact" className="hover:text-primary transition">Request Virtual Sample Mockup</Link></li>
              <li><Link to="/about" className="hover:text-primary transition">Company Heritage & Clients</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-serif font-bold text-base mb-5 tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Connect with Concierge
            </h4>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Registered Corporate Office: Mumbai & Pune, Maharashtra, India.
            </p>
            <div className="flex space-x-3 mb-6">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-dark hover:bg-primary transition-all" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-dark hover:bg-primary transition-all" title="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-dark hover:bg-primary transition-all" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-[11px] text-gray-400">
              <span className="text-primary font-semibold">Priority SLA:</span> Typical corporate quotation delivery in &lt;120 minutes.
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-8 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Impressions Luxury Gifting Pvt. Ltd. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="text-gray-400">Authorized B2B Channel</span>
            <span>•</span>
            <span className="text-gray-400">100% Genuine Provenance</span>
            <span>•</span>
            <span className="text-gray-400">Pan-India Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
