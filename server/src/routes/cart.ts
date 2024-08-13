import { Router } from 'express';
import validateToken from './validate-token';
import { addToCart, getCartItems } from '../controllers/cart';

const router = Router();

router.post('/', validateToken, addToCart); // Ruta para agregar al carrito
router.get('/', validateToken, getCartItems); // Ruta para obtener los items del carrito

export default router;
