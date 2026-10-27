import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminProducts from './pages/admin/AdminProducts';
import ProductForm from './pages/admin/ProductForm';
import AdminImport from './pages/admin/AdminImport';
import AdminOrders from './pages/admin/AdminOrders';
import AdminBanners from './pages/admin/AdminBanners';
import AdminLogin from './pages/admin/AdminLogin';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
                  <h2 className="text-2xl font-bold font-serif mb-2 text-gray-900">Welcome to Impressions Admin Desk</h2>
                  <p className="text-gray-500 text-sm">Manage festive hero banners, bulk corporate catalog, and order quotes.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <a href="/admin/banners" className="p-6 bg-gradient-to-br from-amber-500/10 via-amber-50 to-white border border-amber-200 rounded-2xl hover:border-amber-400 hover:shadow-md transition-all group">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">New Feature</span>
                    <h3 className="font-serif font-bold text-xl text-gray-900 group-hover:text-amber-800 transition-colors mt-3">Hero Banners Manager</h3>
                    <p className="text-gray-600 text-xs mt-1">Drag and drop Diwali, festive and seasonal banners directly into the homepage slider.</p>
                  </a>
                  <a href="/admin/products" className="p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all group">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">Inventory</span>
                    <h3 className="font-serif font-bold text-xl text-gray-900 group-hover:text-blue-700 transition-colors mt-3">Products & Catalog</h3>
                    <p className="text-gray-600 text-xs mt-1">View, edit, search and update products, categories and branding features.</p>
                  </a>
                </div>
              </div>
            } />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/import" element={<AdminImport />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="settings" element={<div className="p-8 bg-white rounded-lg shadow-sm border text-center">Settings coming soon...</div>} />
          </Route>
        </Route>

        {/* Public Routes */}
        <Route path="/*" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetails />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
