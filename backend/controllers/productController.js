import { Product, Category } from '../models/index.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category }]
    });
    
    const formattedProducts = products.map(p => {
      const data = p.toJSON();
      data.category = data.Category ? data.Category.name : 'Uncategorized';
      delete data.Category;
      return data;
    });

    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }]
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    const data = product.toJSON();
    data.category = data.Category ? data.Category.name : 'Uncategorized';
    delete data.Category;
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    let { name, slug, category, description, shortDescription, images, features, price, salePrice, stock, sku, isActive, isFeatured } = req.body;
    
    // Find category ID by name
    let cat = await Category.findOne({ where: { name: category } });
    if (!cat) {
      cat = await Category.create({ name: category, slug: category.toLowerCase().replace(/ /g, '-') });
    }

    const product = await Product.create({
      name, slug, categoryId: cat.id, description, shortDescription, 
      images: images || [], features: features || [],
      price: price === '' ? null : (price || null), 
      salePrice: salePrice === '' ? null : (salePrice || null), 
      stock: stock === '' ? 0 : (stock || 0), 
      sku: sku === '' ? null : (sku || null), 
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let { name, slug, category, description, shortDescription, images, features, price, salePrice, stock, sku, isActive, isFeatured } = req.body;
    
    let categoryId = product.categoryId;
    if (category) {
      let cat = await Category.findOne({ where: { name: category } });
      if (!cat) {
        cat = await Category.create({ name: category, slug: category.toLowerCase().replace(/ /g, '-') });
      }
      categoryId = cat.id;
    }

    await product.update({
      name, slug, categoryId, description, shortDescription, 
      images: images || product.images, features: features || product.features,
      price: price === '' ? null : (price !== undefined ? price : product.price),
      salePrice: salePrice === '' ? null : (salePrice !== undefined ? salePrice : product.salePrice),
      stock: stock === '' ? 0 : (stock !== undefined ? parseInt(stock, 10) : product.stock),
      sku: sku === '' ? null : (sku !== undefined ? sku : product.sku),
      isActive: isActive !== undefined ? isActive : product.isActive,
      isFeatured: isFeatured !== undefined ? isFeatured : product.isFeatured
    });

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: `DB Error: ${error.message}` });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const bulkCreateProducts = async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    const createdProducts = [];
    const errors = [];

    // Fetch existing categories to map
    const existingCats = await Category.findAll();
    const catMap = {};
    existingCats.forEach(c => { catMap[c.name.toLowerCase()] = c.id; });

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      try {
        // Find or create category
        let catId = catMap[p.category?.toLowerCase()];
        if (!catId) {
          const newCat = await Category.create({ 
            name: p.category, 
            slug: p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
          });
          catId = newCat.id;
          catMap[p.category.toLowerCase()] = catId;
        }

        // Process features (can be string or array)
        let features = p.features || [];
        if (typeof features === 'string') {
          features = features.split('|').map(f => f.trim()).filter(Boolean);
        }

        // Process images (can be string or array)
        let images = p.images || [];
        if (typeof images === 'string') {
          images = images.split(',').map(img => img.trim()).filter(Boolean);
        }

        const newProd = await Product.create({
          sku: p.sku || null,
          name: p.name,
          slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          categoryId: catId,
          description: p.description || '',
          shortDescription: p.shortDescription || p.description?.substring(0, 100) || '',
          images,
          features
        });
        
        createdProducts.push(newProd);
      } catch (err) {
        errors.push({ row: i + 1, name: p.name, error: err.message });
      }
    }

    res.status(201).json({
      message: `Successfully imported ${createdProducts.length} products`,
      successCount: createdProducts.length,
      errors
    });
  } catch (error) {
    console.error('Error in bulk import:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const seedProducts = async (req, res) => {
  try {
    const dummyCategories = [
      { name: 'Electronics', slug: 'electronics' },
      { name: 'Accessories', slug: 'accessories' },
      { name: 'Home & Kitchen', slug: 'home-kitchen' },
      { name: 'Stationery', slug: 'stationery' }
    ];

    await Category.sync({ force: true });
    await Product.sync({ force: true });

    const createdCategories = await Category.bulkCreate(dummyCategories);
    
    // Create a map to easily get categoryId by name
    const categoryMap = {};
    createdCategories.forEach(c => {
      categoryMap[c.name] = c.id;
    });

    const dummyProducts = [
      {
        name: "Executive Leather Notebook",
        slug: "executive-leather-notebook",
        categoryId: categoryMap['Stationery'],
        description: "Premium full-grain leather notebook with unlined pages. Perfect for executives and professionals. The supple leather cover develops a beautiful patina over time, while the thick, acid-free pages provide a smooth writing experience for fountain pens and ballpoints alike.",
        shortDescription: "Premium full-grain leather notebook with unlined pages.",
        images: ["https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80", "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80"],
        features: ["Full-grain Italian leather", "200 acid-free ivory pages", "Elastic closure & ribbon marker", "Customizable embossing available"]
      },
      {
        name: "Wireless Noise-Cancelling Headphones",
        slug: "wireless-noise-cancelling-headphones",
        categoryId: categoryMap['Electronics'],
        description: "High-fidelity audio with active noise cancellation for deep focus. These premium headphones offer up to 30 hours of battery life, crystal-clear microphone quality for conference calls, and plush ear cushions for all-day comfort in the office or on the go.",
        shortDescription: "High-fidelity audio with active noise cancellation.",
        images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80"],
        features: ["Active Noise Cancellation (ANC)", "30-hour battery life", "Built-in dual microphones", "Premium travel case included"]
      }
    ];

    await Product.bulkCreate(dummyProducts);
    res.json({ message: 'Products and Categories seeded successfully' });
  } catch (error) {
    console.error('Error seeding products:', error);
    res.status(500).json({ message: 'Server Error during seeding', error: error.message });
  }
};
