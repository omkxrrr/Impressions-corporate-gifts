import express from 'express';
import { upload, uploadProductImage } from '../controllers/uploadController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected Admin Route
router.post('/image', protectAdmin, upload.single('image'), uploadProductImage);

export default router;
