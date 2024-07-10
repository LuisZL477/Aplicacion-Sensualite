import { Router } from 'express';
import { getProduct, getProducts } from '../controllers/product';
import validateToken from './validate-token';

const router = Router();

router.get('/', validateToken, getProducts)
router.get('/:id', getProduct)


export default router;


