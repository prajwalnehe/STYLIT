import { Router } from 'express';
import { getLogo } from '../controllers/admin.controller.js';

const router = Router();

// Public endpoint to get logo settings (no auth required)
router.get('/logo', getLogo);

export default router;

