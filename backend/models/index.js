import Product from './Product.js';
import Category from './Category.js';
import Admin from './Admin.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';

// Setup Relationships
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

export { Product, Category, Admin, Order, OrderItem };
