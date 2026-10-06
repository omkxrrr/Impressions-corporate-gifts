import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { Filter, X, Search } from 'lucide-react';

const Shop = () => {
  const { products, categories, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [sortOption, setSortOption] = useState('popular');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Newest sort implementation (dummy logic using ID for demo)
    if (sortOption === 'newest') {
      result = [...result].sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortOption]);

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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  const { error } = useProducts();

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md">
            <strong>Warning:</strong> Backend connection failed ({error}). Using local dummy data instead.
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop</h1>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                  className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="popular">Popular</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
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

            
            <button 
              onClick={() => {
                setSearchTerm('');
                handleCategoryChange('All');
                setSortOption('popular');
                setIsMobileFiltersOpen(false);
              }}
              className="mt-8 w-full py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition text-sm font-medium"
            >
              Clear Filters
            </button>
          </aside>

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
                  }}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">Showing {filteredProducts.length} results</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
