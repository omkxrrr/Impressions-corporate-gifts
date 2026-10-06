import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">We'd love to hear from you. Please fill out this form or shoot us an email.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="bg-dark p-10 text-white">
            <h2 className="text-2xl font-bold mb-8 font-serif">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 mr-4 mt-1 opacity-80 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Our Location</h3>
                  <p className="opacity-80">Chintamaninager Ph1<br/>Bibvewadi, Pune<br/>Maharashtra 411037</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="w-6 h-6 mr-4 mt-1 opacity-80 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                  <p className="opacity-80">+91 76208 72092</p>
                  <p className="opacity-80 text-sm mt-1">Mon-Fri from 9am to 6pm</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-6 h-6 mr-4 mt-1 opacity-80 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                  <p className="opacity-80">support@impressions.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10">
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              const fd = new FormData(e.target);
              const message = encodeURIComponent(`Hello Impressions,\n\nName: ${fd.get('name')}\nEmail: ${fd.get('email')}\nPhone: ${fd.get('phone')}\n\nMessage:\n${fd.get('message')}`);
              window.open(`https://wa.me/917620872092?text=${message}`, '_blank');
            }}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input name="name" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                  <input name="email" type="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input name="phone" type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea name="message" rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary" required></textarea>
                </div>
                <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-primary-hover transition">
                  Send Message
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Google Maps */}
        <div className="mt-12 w-full h-96 rounded-xl overflow-hidden border border-gray-300 shadow-sm relative">
          <iframe 
            src="https://maps.google.com/maps?q=Chintamaninager%20Ph1,%20Bibvewadi,%20Pune,%20411037&t=&z=14&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Impressions Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
