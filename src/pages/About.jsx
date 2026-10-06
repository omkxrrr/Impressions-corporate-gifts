import { Link } from 'react-router-dom';
import { CheckCircle, Shield, Truck, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-dark text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif text-primary">About Us</h1>
        <p className="text-xl max-w-2xl mx-auto px-4 opacity-90 font-light">Crafting corporate relationships through premium gifting.</p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Brand Story & Who We Are */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-20">
          <div className="lg:w-1/2">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                alt="Impressions Team" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Who We Are</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Welcome to Impressions, your premier destination for corporate gifting. We specialize in curating high-quality, memorable products that help businesses express appreciation, celebrate milestones, and build lasting relationships.
            </p>
            <p className="text-gray-600 leading-relaxed">
              With years of experience in the B2B sector, we understand that a corporate gift is more than just an item—it's a reflection of your brand's values. That's why we meticulously source our catalog to ensure every piece meets the highest standards of elegance and durability.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 font-serif">What We Offer</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-500 text-sm">Handpicked premium items that leave a lasting impression.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trusted Service</h3>
              <p className="text-gray-500 text-sm">Reliable B2B partnership with transparent communication.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Truck className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-500 text-sm">Pan-India expedited shipping for all your bulk orders.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Heart className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
              <p className="text-gray-500 text-sm">Dedicated account managers for a seamless experience.</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 font-serif">Why Choose Us?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border-t-4 border-primary">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Branding</h3>
              <p className="text-gray-600">Elevate your corporate gifts with our precise logo engraving and premium custom packaging options.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border-t-4 border-primary">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Bulk Pricing</h3>
              <p className="text-gray-600">Enjoy highly competitive wholesale rates tailored specifically for corporate and B2B requirements.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border-t-4 border-primary">
              <h3 className="text-xl font-bold text-gray-900 mb-3">End-to-End Solutions</h3>
              <p className="text-gray-600">From curation to delivery, we handle the entire logistics pipeline so you can focus on your business.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/shop" className="inline-block bg-primary text-white font-bold py-4 px-10 rounded-md hover:bg-primary-hover transition shadow-lg text-lg">
            Shop Now
          </Link>
        </div>

      </div>
    </div>
  );
};

export default About;
