import {Router} from 'express';
import { getShopping } from '../controllers/shopping';
import validateToken from './validate-token';


const router = Router();
router.get('/', validateToken, getShopping);


export default router;