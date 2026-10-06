import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [isPlaced, setIsPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  if (cart.length === 0 && !isPlaced && !isSubmitting) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
      
      const orderPayload = {
        customerName: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        address: fullAddress,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) throw new Error('Failed to place order in database');

      // Build WhatsApp message
      const itemsText = cart.map(item => `- ${item.name} (${item.quantity}x)`).join('\n');
      const message = encodeURIComponent(`Hello Impressions, I would like to place an order request.\n\n*Customer Details:*\nName: ${formData.name}\nMobile: ${formData.mobile}\nEmail: ${formData.email}\n\n*Delivery Address:*\n${fullAddress}\n\n*Order Summary:*\n${itemsText}\n\nPlease review and get back to me.`);
      window.open(`https://wa.me/917620872092?text=${message}`, '_blank');

      setIsPlaced(true);
      clearCart();
    } catch (err) {
      alert("Something went wrong while placing the order. Opening WhatsApp anyway.");
      // Fallback if DB fails
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
      const itemsText = cart.map(item => `- ${item.name} (${item.quantity}x)`).join('\n');
      const message = encodeURIComponent(`Hello Impressions, I would like to place an order request.\n\n*Customer Details:*\nName: ${formData.name}\nMobile: ${formData.mobile}\nEmail: ${formData.email}\n\n*Delivery Address:*\n${fullAddress}\n\n*Order Summary:*\n${itemsText}\n\nPlease review and get back to me.`);
      window.open(`https://wa.me/917620872092?text=${message}`, '_blank');
      
      setIsPlaced(true);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
        <h2 className="text-xl font-medium text-gray-700">Processing your order request...</h2>
      </div>
    );
  }

  if (isPlaced) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-gray-50">
        <div className="bg-white p-10 rounded-xl shadow-md text-center max-w-lg w-full border border-gray-100">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Request Submitted!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for reaching out. Our team will review your requirements and get back to you with a customized quote soon.
          </p>
          <div className="bg-gray-50 p-4 rounded-md mb-8 text-left border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Order ID:</p>
            <p className="font-mono font-medium text-gray-900 mb-3">#ORD-{Math.floor(100000 + Math.random() * 900000)}</p>
            <p className="text-sm text-gray-500 mb-1">Customer Details:</p>
            <p className="font-medium text-gray-900">{formData.name}, {formData.city}</p>
          </div>
          <Link 
            to="/shop" 
            className="block w-full bg-primary text-white font-medium py-3 rounded-md hover:bg-primary-hover transition shadow-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
              
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input required type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Delivery Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white font-bold py-4 px-4 rounded-md hover:bg-primary-hover transition shadow-sm text-lg disabled:opacity-70"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">We will get back to you with a customized quote.</p>
              </div>

            </form>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Selected Items</h2>
              
              <ul className="divide-y divide-gray-100 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.map(item => (
                  <li key={item.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-12 h-12 border border-gray-200 rounded-md overflow-hidden bg-gray-50 mr-3">
                        <img 
                          src={item.images[0]} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-800 text-sm font-medium line-clamp-1">{item.name}</span>
                        <span className="text-gray-500 text-xs mt-0.5">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="space-y-3 border-t border-gray-200 pt-4 mb-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span className="font-bold">Total Items</span>
                  <span className="font-bold">{cart.reduce((a,c) => a + c.quantity, 0)}</span>
                </div>
                {getCartTotal() > 0 && (
                  <div className="flex justify-between text-gray-900 font-bold border-t border-gray-100 pt-3 text-lg">
                    <span>Order Total</span>
                    <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
