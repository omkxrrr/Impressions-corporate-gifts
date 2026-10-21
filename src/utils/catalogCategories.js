// Centralized Apparel Catalog & Sub-Catalogue definition

export const APPAREL_SUBCATALOGS = [
  {
    id: 'all',
    name: 'All Corporate Apparel',
    tagline: 'Complete B2B catalog across all brands and styles',
    matcher: () => true
  },
  {
    id: 't-shirts',
    name: 'T-Shirts & Polos',
    tagline: 'Polo shirts, dryfit tees, tipping collars & executive casuals',
    matcher: (text) => text.match(/t-?shirt|polo|dryfit|tee|round neck|henley/i),
    brands: ['Scott International', 'Jack & Jones', 'Rare Rabbit', 'Reebok', 'UCB (Benetton)', 'Arrow', 'Monte Carlo', 'French Connection', 'Adidas', 'Puma']
  },
  {
    id: 'shirts',
    name: 'Formal & Oxford Shirts',
    tagline: '100% cotton Oxford, Giza Gilt, formal woven & dress shirts',
    matcher: (text) => text.match(/\bshirt\b|oxford|formal shirt|cotton shirt|giza/i) && !text.match(/dryfit shirt with placket/i),
    brands: ['Monte Carlo', 'Rare Rabbit', 'Arrow', 'French Connection', 'Jack & Jones']
  },
  {
    id: 'pants',
    name: 'Pants & Tracksuits',
    tagline: 'Executive track suits, active joggers, trousers & bottoms',
    matcher: (text) => text.match(/track\s?suit|pant|trouser|bottom|chino|jogger/i),
    brands: ['Monte Carlo', 'Adidas', 'Puma']
  },
  {
    id: 'jackets',
    name: 'Jackets & Outerwear',
    tagline: 'Suede jackets, winterwear, hoodies, blazers & pullovers',
    matcher: (text) => text.match(/jacket|blazer|hoodie|sweater|sweatshirt|windcheater|coat/i),
    brands: ['Jack & Jones', 'Rare Rabbit', 'Reebok', 'Monte Carlo', 'French Connection']
  }
];

export const BRAND_ALIASES = {
  'Puma': ['puma', 'one8', '676344', '627274', '676731', '676775', '671388', '677286', '677287', '677230', '025329', '079980', '051041', '053985', 'ess pique tipping polo'],
  'Adidas': ['adidas'],
  'Nike': ['nike'],
  'Reebok': ['reebok', 'incn', 'inps', 'intt', 'rbk'],
  'Scott International': ['scott international', 'scott', 'scott premium', 'scott-international', 'sp-'],
  'Rare Rabbit': ['rare rabbit', 'rare-rabbit', 'rarerabbit', 'rr-p', 'rr-'],
  'Jack & Jones': ['jack & jones', 'jack and jones', 'jack jones', 'jack&jones', 'vilmar', 'ethan', 'asger', 'kornad', 'austin', 'nashville', 'madd polo', 'viktor', 'joren', 'icero', 'demian', 'carline'],
  'Monte Carlo': ['monte carlo', 'mc-'],
  'UCB (Benetton)': ['ucb', 'benetton', 'united colors of benetton'],
  'French Connection': ['french connection', 'fcuk'],
  'Arrow': ['arrow', 'arik', 'asit'],
  'Wildcraft': ['wildcraft'],
  'Tommy Hilfiger': ['tommy hilfiger', 'tommy'],
  "Levi's": ["levi's", 'levis', 'levi strauss']
};

export const detectBrand = (product) => {
  if (!product) return 'Unbranded';
  
  // 1. Direct product.brand attribute (from DB/JSON)
  if (product.brand && typeof product.brand === 'string') {
    const bTrim = product.brand.trim();
    if (bTrim && bTrim !== 'Corporate Collection' && bTrim.toLowerCase() !== 'unbranded') {
      return bTrim;
    }
  }

  // 2. Check features array for "Brand: XYZ"
  if (Array.isArray(product.features)) {
    for (const f of product.features) {
      const m = String(f).match(/^(?:Brand|Manufacturer)\s*[:=-]\s*(.+)$/i);
      if (m && m[1].trim() && m[1].trim() !== 'Corporate Collection') {
        return m[1].trim();
      }
    }
  }

  const name = (product.name || '').toLowerCase();
  const sku = (product.sku || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();

  // 3. High-precision explicit brand detector on Product Name & SKU first
  // (Prevents fabric keywords or sub-aliases from stealing brand identity)
  if (name.includes('puma') || sku.startsWith('676') || sku.startsWith('627') || sku.startsWith('025') || sku.startsWith('079') || sku.startsWith('051') || sku.startsWith('053') || name.includes('one8') || name.includes('ess pique tipping polo')) {
    return 'Puma';
  }
  if (name.includes('adidas')) {
    return 'Adidas';
  }
  if (name.includes('nike')) {
    return 'Nike';
  }
  if (name.includes('reebok') || name.includes('rbk') || sku.startsWith('incn') || sku.startsWith('inps') || sku.startsWith('intt')) {
    return 'Reebok';
  }
  if (name.includes('rare rabbit') || name.includes('rarerabbit') || sku.startsWith('rr-')) {
    return 'Rare Rabbit';
  }
  if (name.includes('scott international') || name.includes('scott') || sku.startsWith('sp-')) {
    return 'Scott International';
  }
  if (name.includes('jack & jones') || name.includes('jack and jones') || name.includes('jack jones') || name.includes('jack&jones')) {
    return 'Jack & Jones';
  }
  if (name.includes('monte carlo') || sku.startsWith('mc-') || sku.startsWith('p38') || sku.startsWith('p41')) {
    return 'Monte Carlo';
  }
  if (name.includes('french connection') || name.includes('fcuk') || (sku.startsWith('fc-') && !sku.includes('pfc'))) {
    return 'French Connection';
  }
  if (name.includes('arrow') || sku.startsWith('arik') || sku.startsWith('asit')) {
    return 'Arrow';
  }
  if (name.includes('benetton') || name.includes('ucb') || sku.startsWith('ucb')) {
    return 'UCB (Benetton)';
  }
  if (name.includes('levi')) {
    return "Levi's";
  }
  if (name.includes('tommy')) {
    return 'Tommy Hilfiger';
  }
  if (name.includes('wildcraft')) {
    return 'Wildcraft';
  }

  // 4. Secondary Model Matchers for legacy unbranded imports (e.g. Jack & Jones specific styles)
  const jjStyles = ['vilmar', 'ethan', 'asger', 'kornad', 'madd polo', 'viktor', 'joren', 'icero', 'demian', 'carline', 'austin hoodie'];
  if (jjStyles.some(s => name.includes(s) || desc.includes(s))) {
    return 'Jack & Jones';
  }

  // 5. Try extracting brand name from product name if prefixed (e.g. "BrandName - Product")
  const dashMatch = product.name?.trim().match(/^([A-Za-z0-9&'.\s]{2,25})\s*[-–:]\s*/);
  if (dashMatch) {
    const cand = dashMatch[1].trim();
    if (!cand.match(/^(men|women|unisex|pure|classic|premium|cotton|poly|ess|round neck)$/i)) {
      return cand;
    }
  }

  return product.brand || 'Corporate Collection';
};

export const matchesBrand = (product, brandName) => {
  if (!brandName || brandName === 'All Brands') return true;

  const target = brandName.toLowerCase();

  // 1. Exact match on product.brand
  if (product.brand && product.brand.toLowerCase() === target) {
    return true;
  }

  // 2. Exact match on detectedBrand
  const detected = detectBrand(product);
  if (detected.toLowerCase() === target) {
    return true;
  }

  // 3. Strict isolation: If product belongs to a different known partner brand, DO NOT cross-match!
  if (detected && detected !== 'Unbranded' && detected !== 'Corporate Collection') {
    return false;
  }

  // 4. Fallback for unbranded items only
  const aliases = BRAND_ALIASES[brandName] || [target];
  const text = `${product.name || ''} ${product.description || ''} ${(product.features || []).join(' ')} ${product.sku || ''}`.toLowerCase();
  return aliases.some(alias => {
    // Avoid short substring collisions like 'fc-' matching inside 'pfc-free'
    if (alias === 'fc-') {
      return (product.sku || '').toLowerCase().startsWith('fc-');
    }
    return text.includes(alias.toLowerCase());
  });
};

export const matchesSubCatalog = (product, subCatalogId) => {
  if (!subCatalogId || subCatalogId === 'all') return true;
  const sub = APPAREL_SUBCATALOGS.find(s => s.id === subCatalogId);
  if (!sub) return true;
  const text = `${product.name || ''} ${product.description || ''} ${(product.features || []).join(' ')} ${product.sku || ''}`.toLowerCase();
  return sub.matcher(text);
};

