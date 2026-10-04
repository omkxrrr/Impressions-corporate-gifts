import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const delivery = getCartTotal() > 1000 ? 0 : 99;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-gray-50">
        <div className="bg-white p-8 rounded-full shadow-sm mb-6">
          <ShoppingBag className="w-16 h-16 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added anything to your cart yet. Let's get you back to shopping.
        </p>
        <Link 
          to="/shop" 
          className="bg-blue-600 text-white font-medium px-8 py-3 rounded-md hover:bg-blue-700 transition shadow-sm"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-500">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li key={item.id} className="p-4 sm:p-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                    {/* Product Info */}
                    <div className="col-span-6 flex items-center w-full">
                      <Link to={`/product/${item.id}`} className="flex-shrink-0 w-20 h-20 border border-gray-200 rounded-md overflow-hidden bg-gray-50">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover object-center"
                        />
                      </Link>
                      <div className="ml-4 flex-1">
                        <Link to={`/product/${item.id}`} className="text-base font-medium text-gray-900 hover:text-blue-600 line-clamp-2">
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                        {/* Mobile Price & Remove */}
                        <div className="mt-2 flex items-center justify-between sm:hidden">
                          <span className="font-medium text-gray-900">₹{item.price.toLocaleString()}</span>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Price */}
                    <div className="col-span-2 hidden sm:block text-center font-medium text-gray-900">
                      ₹{item.price.toLocaleString()}
                    </div>

                    {/* Quantity */}
                    <div className="col-span-12 sm:col-span-2 flex justify-center w-full sm:w-auto mt-4 sm:mt-0">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >-</button>
                        <span className="px-4 py-1 text-center font-medium border-x border-gray-300 min-w-[2.5rem]">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >+</button>
                      </div>
                    </div>

                    {/* Desktop Total & Remove */}
                    <div className="col-span-2 hidden sm:flex items-center justify-end gap-4">
                      <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.reduce((a,c) => a + c.quantity, 0)} items)</span>
                  <span className="font-medium text-gray-900">₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Estimate</span>
                  {delivery === 0 ? (
                    <span className="font-medium text-green-600">Free</span>
                  ) : (
                    <span className="font-medium text-gray-900">₹{delivery}</span>
                  )}
                </div>
                {delivery > 0 && (
                  <p className="text-xs text-gray-500">Add ₹{(1000 - getCartTotal()).toLocaleString()} more to get free delivery.</p>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-gray-900">₹{(getCartTotal() + delivery).toLocaleString()}</span>
                </div>
              </div>

              <Link 
                to="/checkout" 
                className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition shadow-sm"
              >
                Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
              </Link>

              <div className="mt-4 text-center">
                <Link to="/shop" className="text-sm text-blue-600 hover:underline">
                  or Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
