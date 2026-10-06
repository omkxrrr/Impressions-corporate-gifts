import { Order, OrderItem, Product } from '../models/index.js';

// Create new order (Public API for checkout)
export const createOrder = async (req, res) => {
  try {
    const { customerName, email, mobile, address, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    const order = await Order.create({
      customerName,
      email,
      mobile,
      address,
      status: 'Pending'
    });

    // Create order items
    const orderItemsData = items.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity
    }));

    await OrderItem.bulkCreate(orderItemsData);

    // Reduce Stock for each product
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await product.update({ stock: newStock });
      }
    }

    res.status(201).json({ message: 'Order created successfully', orderId: order.id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders (Admin Protected)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'name', 'images'] }]
        }
      ]
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status (Admin Protected)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem }]
    });
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    const oldStatus = order.status;
    await order.update({ status });

    // Restore stock if order is cancelled
    if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
      for (const item of order.OrderItems) {
        const product = await Product.findByPk(item.productId);
        if (product) {
          await product.update({ stock: product.stock + item.quantity });
        }
      }
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
