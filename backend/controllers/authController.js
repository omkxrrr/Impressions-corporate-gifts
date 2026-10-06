import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Admin } from '../models/index.js';

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if admin exists
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET || 'supersecretkey123',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: { id: admin.id, email: admin.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Setup initial admin if table is empty (utility function)
export const setupAdmin = async (req, res) => {
  try {
    const count = await Admin.count();
    if (count > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({ email: 'admin@impressions.com', password: hashedPassword });
    
    res.json({ message: 'Default admin created (admin@impressions.com / admin123)' });
  } catch (error) {
    res.status(500).json({ message: 'Error setting up admin' });
  }
};
