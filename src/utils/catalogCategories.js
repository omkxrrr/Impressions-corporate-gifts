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
    brands: ['Jack & Jones', 'Rare Rabbit', 'Reebok', 'UCB (Benetton)', 'Arrow', 'Monte Carlo', 'French Connection', 'Adidas', 'Puma']
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
  'Jack & Jones': ['jack & jones', 'jack and jones', 'jack jones', 'jack&jones', 'vilmar', 'ethan', 'asger', 'kornad', 'suede jacket', 'austin', 'nashville', 'madd polo', 'plain polo', 'jacquard', 'interlock', 'viktor', 'coolmax', 'slt', 'joren', 'icero', 'demian', 'carline'],
  'Rare Rabbit': ['rare rabbit', 'rare-rabbit', 'rarerabbit', 'rr-p', 'rr-'],
  'Reebok': ['reebok', 'incn', 'inps', 'intt', 'rbk'],
  'Scott International': ['scott international', 'scott', 'scott premium', 'scott-international', 'sp-'],
  'Monte Carlo': ['monte carlo', 'mc-'],
  'UCB (Benetton)': ['ucb', 'benetton', 'united colors of benetton'],
  'French Connection': ['french connection', 'fcuk', 'fc-'],
  'Arrow': ['arrow', 'arik', 'asit'],
  'Adidas': ['adidas'],
  'Puma': ['puma'],
  'Nike': ['nike'],
  'Wildcraft': ['wildcraft'],
  'Tommy Hilfiger': ['tommy hilfiger', 'tommy'],
  "Levi's": ["levi's", 'levis', 'levi strauss']
};

export const detectBrand = (product) => {
  if (!product) return 'Unbranded';
  
  // 1. Direct product.brand attribute (from DB/JSON)
  if (product.brand && typeof product.brand === 'string' && product.brand.trim() && product.brand !== 'Corporate Collection') {
    return product.brand.trim();
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

  // 3. Check known BRAND_ALIASES against product text
  const text = `${product.name || ''} ${product.description || ''} ${(product.features || []).join(' ')} ${product.sku || ''}`.toLowerCase();
  for (const [canonicalBrand, aliases] of Object.entries(BRAND_ALIASES)) {
    if (aliases.some(alias => text.includes(alias.toLowerCase()))) {
      return canonicalBrand;
    }
  }

  // 4. Try extracting brand name from product name if prefixed (e.g. "BrandName - Product")
  if (product.name) {
    const dashMatch = product.name.trim().match(/^([A-Za-z0-9&'.\s]{2,25})\s*[-–:]\s*/);
    if (dashMatch) {
      const cand = dashMatch[1].trim();
      if (!cand.match(/^(men|women|unisex|pure|classic|premium|cotton|poly)$/i)) {
        return cand;
      }
    }
  }

  return product.brand || 'Corporate Collection';
};

export const matchesBrand = (product, brandName) => {
  if (!brandName || brandName === 'All Brands') return true;

  // Exact or case-insensitive match on product.brand
  if (product.brand && product.brand.toLowerCase() === brandName.toLowerCase()) {
    return true;
  }

  // Check detected brand
  const detected = detectBrand(product);
  if (detected.toLowerCase() === brandName.toLowerCase()) {
    return true;
  }

  // Check aliases or name containment
  const aliases = BRAND_ALIASES[brandName] || [brandName.toLowerCase()];
  const text = `${product.name || ''} ${product.description || ''} ${(product.features || []).join(' ')} ${product.sku || ''}`.toLowerCase();
  if (aliases.some(alias => text.includes(alias.toLowerCase()))) {
    return true;
  }

  return text.includes(brandName.toLowerCase());
};

export const matchesSubCatalog = (product, subCatalogId) => {
  if (!subCatalogId || subCatalogId === 'all') return true;
  const sub = APPAREL_SUBCATALOGS.find(s => s.id === subCatalogId);
  if (!sub) return true;
  const text = `${product.name || ''} ${product.description || ''} ${(product.features || []).join(' ')} ${product.sku || ''}`.toLowerCase();
  return sub.matcher(text);
};

