import { Router } from 'express';
import { getUserOrders } from '../controllers/order';

const router = Router();

// Ruta para obtener las compras del usuario logueado
router.get('/orders', getUserOrders);

export default router;
