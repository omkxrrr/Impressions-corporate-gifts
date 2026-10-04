import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';
import { Filter, X, Search } from 'lucide-react';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [sortOption, setSortOption] = useState('popular');
  const [priceRange, setPriceRange] = useState(15000);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    let result = products;

    // Filter by search
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by price
    result = result.filter(p => p.price <= priceRange);

    // Sort
    if (sortOption === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, sortOption, priceRange]);

  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    } else if (!categoryParam) {
      setSelectedCategory('All');
    }
  }, [categoryParam]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop</h1>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Mobile Filter Toggle & Sort */}
            <div className="flex items-center justify-between gap-4">
              <button 
                onClick={() => setIsMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white"
              >
                <Filter className="w-4 h-4" /> Filters
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:inline">Sort:</span>
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="popular">Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters (Desktop) / Modal (Mobile) */}
          <div className={`
            fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden
            ${isMobileFiltersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `} onClick={() => setIsMobileFiltersOpen(false)}></div>
          
          <aside className={`
            fixed md:static inset-y-0 left-0 z-50 w-72 bg-white md:bg-transparent p-6 md:p-0 overflow-y-auto transform transition-transform duration-300 ease-in-out md:transform-none md:w-64 flex-shrink-0
            ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex items-center justify-between md:hidden mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)}><X className="w-6 h-6" /></button>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">Categories</h3>
              <ul className="space-y-3">
                <li>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={selectedCategory === 'All'}
                      onChange={() => handleCategoryChange('All')}
                      className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                    />
                    <span className={selectedCategory === 'All' ? 'font-medium text-blue-600' : 'text-gray-600'}>All Categories</span>
                  </label>
                </li>
                {categories.map(cat => (
                  <li key={cat}>
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="category" 
                        checked={selectedCategory === cat}
                        onChange={() => handleCategoryChange(cat)}
                        className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                      />
                      <span className={selectedCategory === cat ? 'font-medium text-blue-600' : 'text-gray-600'}>{cat}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">Price Range</h3>
              <div className="mb-2 flex justify-between text-sm text-gray-600">
                <span>₹0</span>
                <span>₹{priceRange.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="20000" 
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            
            <button 
              onClick={() => {
                setSearchTerm('');
                handleCategoryChange('All');
                setPriceRange(15000);
                setSortOption('popular');
                setIsMobileFiltersOpen(false);
              }}
              className="mt-8 w-full py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition text-sm font-medium"
            >
              Clear Filters
            </button>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filters.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    handleCategoryChange('All');
                    setPriceRange(15000);
                  }}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">Showing {filteredProducts.length} results</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
