import { Router } from 'express';
import validateToken from './validate-token';
import { addToCart } from '../controllers/cart';

const router = Router();

router.post('/', validateToken, addToCart); // Ruta actualizada

export default router;
