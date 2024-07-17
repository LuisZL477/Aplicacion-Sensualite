import { Router } from 'express';
import {  getProduct, getProducts} from '../controllers/product';
import validateToken from './validate-token';

const router = Router();
router.get('/', validateToken, getProducts);
router.get('/:id', validateToken, getProduct);
// router.delete('/:id', validateToken, deleteProducts);
// router.post('/', validateToken, upload.single('imagen'), postProduct);
// router.put('/:id', validateToken, upload.single('imagen'), updateProduct);
// router.delete('/uploads/:imagePath', validateToken, deleteImage); // Nueva ruta

export default router;



