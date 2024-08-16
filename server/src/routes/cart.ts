import { Router } from 'express';
import validateToken from './validate-token';
import { addToCart, getCartItems, removeFromCart, buyCart } from '../controllers/cart';

const router = Router();

router.post('/', validateToken, addToCart); // Ruta para agregar al carrito
router.get('/', validateToken, getCartItems); // Ruta para obtener los items del carrito
router.post('/buy', validateToken, buyCart); // Ruta para comprar todo el carrito
router.delete('/item/:id', validateToken, removeFromCart); // Ruta para eliminar un producto del carrito

export default router;

