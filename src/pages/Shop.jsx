import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { BrandLogo } from '../components/BrandLogo';
import { useProducts } from '../context/ProductContext';
import { Filter, X, Search, Sparkles, Tag, Check, Layers, Shirt, Briefcase, Activity, ShieldCheck } from 'lucide-react';
import { 
  APPAREL_SUBCATALOGS, 
  matchesSubCatalog, 
  matchesBrand,
  detectBrand
} from '../utils/catalogCategories';

const Shop = () => {
  const { products, categories, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const subCatalogParam = searchParams.get('subcatalog') || 'all';
  const brandParam = searchParams.get('brand') || 'All Brands';
  
  const [searchTerm, setSearchTerm] = useState(searchParam || '');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [selectedSubCatalog, setSelectedSubCatalog] = useState(subCatalogParam);
  const [selectedBrand, setSelectedBrand] = useState(brandParam);
  const [sortOption, setSortOption] = useState('popular');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    if (subCatalogParam) setSelectedSubCatalog(subCatalogParam);
    if (brandParam) setSelectedBrand(brandParam);
    if (searchParam) setSearchTerm(searchParam);
  }, [subCatalogParam, brandParam, searchParam]);

  const handleSubCatalogChange = (subId) => {
    setSelectedSubCatalog(subId);
    setSelectedBrand('All Brands'); // Reset brand when switching category
    const newParams = new URLSearchParams(searchParams);
    if (subId === 'all') {
      newParams.delete('subcatalog');
    } else {
      newParams.set('subcatalog', subId);
    }
    newParams.delete('brand');
    setSearchParams(newParams);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    const newParams = new URLSearchParams(searchParams);
    if (brand === 'All Brands') {
      newParams.delete('brand');
    } else {
      newParams.set('brand', brand);
    }
    setSearchParams(newParams);
  };

  // Filter products based on SubCatalog, Brand, Search, and Category
  const filteredProducts = useMemo(() => {
    let result = products || [];

    // 1. Sub-Catalog Filter (T-Shirts, Shirts, Pants, etc.)
    if (selectedSubCatalog && selectedSubCatalog !== 'all') {
      result = result.filter(p => matchesSubCatalog(p, selectedSubCatalog));
    }

    // 2. Brand Filter
    if (selectedBrand && selectedBrand !== 'All Brands') {
      result = result.filter(p => matchesBrand(p, selectedBrand));
    }

    // 3. Search Term
    if (searchTerm) {
      let term = searchTerm.toLowerCase();
      let searchTerms = [term];
      if (term === 'french connection') searchTerms.push('fc-', 'fcuk');
      if (term === 'ucb') searchTerms.push('benetton');
      if (term.includes('rare') || term.includes('rabbit')) searchTerms.push('rare rabbit', 'rr-p', 'rr-');
      if (term.includes('reebok') || term.includes('rbk')) searchTerms.push('reebok', 'incn', 'inps', 'intt');
      if (term.includes('scott')) searchTerms.push('scott', 'scott international', 'sp-');
      if (term === 'jack jones' || term === 'jack & jones' || term === 'jack&jones') {
        searchTerms.push('jack & jones', 'jack and jones', 'jack jones', 'jack&jones', 'vilmar', 'ethan', 'asger', 'kornad', 'suede jacket', 'austin', 'nashville', 'madd polo', 'plain polo', 'jacquard', 'interlock', 'viktor', 'coolmax', 'slt', 'joren', 'icero', 'demian', 'carline');
      }

      result = result.filter(p => 
        searchTerms.some(t => 
          p.name.toLowerCase().includes(t) || 
          (p.description && p.description.toLowerCase().includes(t)) ||
          (p.features && p.features.some(f => f.toLowerCase().includes(t))) ||
          (p.sku && p.sku.toLowerCase().includes(t))
        )
      );
    }

    // 4. Legacy Category Filter (if specified)
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 5. Sort
    if (sortOption === 'newest') {
      result = [...result].sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, selectedSubCatalog, selectedBrand, searchTerm, selectedCategory, sortOption]);

  // Dynamically compute all brands and counts for the active subcatalog
  const availableBrandsInSubCatalog = useMemo(() => {
    const relevantProducts = (products || []).filter(p => matchesSubCatalog(p, selectedSubCatalog));
    const totalCount = relevantProducts.length;

    // Detect unique brands among products matching this subcatalog
    const brandCounts = new Map();
    relevantProducts.forEach(p => {
      const b = detectBrand(p);
      if (b && b !== 'Unbranded' && b !== 'Corporate Collection') {
        brandCounts.set(b, (brandCounts.get(b) || 0) + 1);
      }
    });

    // Also check known brand aliases for any products in relevantProducts
    const priority = ['Jack & Jones', 'Monte Carlo', 'Rare Rabbit', 'Reebok', 'Scott International', 'UCB (Benetton)', 'French Connection', 'Arrow', 'Adidas', 'Puma', 'Nike'];
    
    // Build combined list
    const brandsFound = new Set([...priority, ...Array.from(brandCounts.keys())]);
    const brandList = [];

    brandsFound.forEach(bName => {
      const count = relevantProducts.filter(p => matchesBrand(p, bName)).length;
      if (count > 0) {
        brandList.push({ name: bName, count });
      }
    });

    // Sort: priority brands first, then by count descending
    brandList.sort((a, b) => {
      const pA = priority.indexOf(a.name);
      const pB = priority.indexOf(b.name);
      if (pA !== -1 && pB !== -1) return pA - pB;
      if (pA !== -1) return -1;
      if (pB !== -1) return 1;
      return b.count - a.count;
    });

    return [{ name: 'All Brands', count: totalCount }, ...brandList];
  }, [products, selectedSubCatalog]);

  const activeSubCatalogObj = APPAREL_SUBCATALOGS.find(s => s.id === selectedSubCatalog) || APPAREL_SUBCATALOGS[0];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500">Loading corporate catalog...</p>
      </div>
    );
  }

  const { error } = useProducts();

  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md">
            <strong>Warning:</strong> Backend connection failed ({error}).
          </div>
        )}

        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-gray-200">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-primary block mb-1.5">Corporate Gifting Catalog</span>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900">Apparel & Merchandising Collections</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-600">
                <span className="inline-flex items-center gap-1.5 font-semibold text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Corporate B2B Wholesale
                </span>
                <span className="text-gray-500">• Indicative MRPs shown • Request best price for bulk quantity</span>
              </div>
            </div>
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search styles, SKUs, fabrics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-xs"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* 1 & 2. Compact & Executive Category & Sub-Category Suite */}
        <div className="mb-6 sm:mb-8 rounded-2xl bg-[#0b0e15] border border-white/10 shadow-lg p-3 sm:p-5 text-white relative overflow-hidden">
          {/* Ambient Subtle Radial Glow */}
          <div className="absolute top-0 right-1/4 w-60 h-60 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10">
            {/* Header: Sleek & Compact Title Bar */}
            <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <h2 className="text-xs uppercase font-bold tracking-wider text-amber-200">
                  Apparel Categories
                </h2>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">
                {filteredProducts.length} Styles Available
              </span>
            </div>

            {/* Tier 1: Main Category Cards (Compact horizontal swipe on mobile, 5-col on desktop) */}
            <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-2 overflow-x-auto pb-1 scrollbar-none mb-2.5">
              {APPAREL_SUBCATALOGS.map((sub) => {
                const isActive = selectedSubCatalog === sub.id;
                const count = products.filter(p => matchesSubCatalog(p, sub.id)).length;
                const IconComp = 
                  sub.id === 'all' ? Layers :
                  sub.id === 't-shirts' ? Shirt :
                  sub.id === 'shirts' ? Briefcase :
                  sub.id === 'pants' ? Activity :
                  ShieldCheck;

                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSubCatalogChange(sub.id)}
                    className={`relative rounded-xl p-2 sm:p-2.5 flex items-center sm:flex-col sm:items-start justify-between text-left transition-all duration-200 shrink-0 min-w-[130px] sm:min-w-0 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r sm:bg-gradient-to-br from-amber-200 via-primary to-amber-500 text-dark font-black shadow-[0_4px_15px_rgba(203,152,52,0.35)] ring-1 ring-amber-300'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 sm:w-full sm:justify-between sm:mb-1">
                      <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-dark text-amber-300' : 'bg-white/10 text-amber-300'
                      }`}>
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-dark text-white' : 'bg-white/10 text-gray-300'
                      }`}>
                        {count}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className={`text-[11px] sm:text-xs font-bold uppercase tracking-wide truncate ${
                        isActive ? 'text-dark' : 'text-white'
                      }`}>
                        {sub.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Tier 2: Sub-Category Brands Shelf (Compact & Connected) */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs text-amber-200 font-semibold">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Brands in {activeSubCatalogObj.name}:</span>
                </div>
                
                {selectedBrand !== 'All Brands' && (
                  <button 
                    onClick={() => handleBrandChange('All Brands')}
                    className="text-xs text-amber-300 hover:text-white font-semibold underline flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Show All</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Brand Pills */}
              <div className="flex flex-wrap gap-1.5">
                {availableBrandsInSubCatalog.map((b) => {
                  const isSelected = selectedBrand === b.name;
                  return (
                    <button
                      key={b.name}
                      onClick={() => handleBrandChange(b.name)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-200 via-primary to-amber-500 text-dark font-bold shadow-xs'
                          : 'bg-white/5 hover:bg-white/15 text-gray-200 border border-white/10'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-dark shrink-0" />}
                      {b.name !== 'All Brands' && (
                        <span className={`shrink-0 flex items-center ${isSelected ? 'text-dark' : 'text-amber-300'}`}>
                          <BrandLogo brand={b.name} size="xs" />
                        </span>
                      )}
                      <span>{b.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        isSelected ? 'bg-dark text-white' : 'bg-white/10 text-gray-400'
                      }`}>
                        {b.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Filter Button and Sort Bar */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          <div className="text-xs sm:text-sm text-gray-600">
            Showing <strong className="text-gray-900 font-bold">{filteredProducts.length}</strong> products
            {selectedBrand !== 'All Brands' && <span> for <strong className="text-primary">{selectedBrand}</strong></span>}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs uppercase font-bold text-gray-500 tracking-wider hidden sm:inline">Sort:</span>
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-200 rounded-lg py-1 px-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary bg-white shadow-xs"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Latest Additions</option>
            </select>
          </div>
        </div>

        {/* Products Grid - 2 columns on mobile, 3-4 columns on desktop */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
              <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-1">No Matching Products Found</h3>
              <p className="text-gray-500 text-xs max-w-sm mx-auto">
                No styles currently match your active sub-catalog and brand combination.
              </p>
              <button 
                onClick={() => {
                  setSelectedSubCatalog('all');
                  setSelectedBrand('All Brands');
                  setSearchTerm('');
                  setSearchParams({});
                }}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-dark text-white hover:bg-primary hover:text-dark text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Shop;
