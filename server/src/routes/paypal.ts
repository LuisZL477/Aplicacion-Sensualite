import { Router } from 'express';
import validateToken from './validate-token';
import { createPayPalTransaction, successPayPalTransaction, cancelPayPalTransaction } from '../controllers/paypal';

const router = Router();

router.post('/create', validateToken, createPayPalTransaction);
router.get('/success', validateToken, successPayPalTransaction);
router.get('/cancel', cancelPayPalTransaction);

export default router;
