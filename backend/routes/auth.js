import express from 'express';
import { loginAdmin, setupAdmin } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/setup', setupAdmin); // Temporary route to create first admin

export default router;
