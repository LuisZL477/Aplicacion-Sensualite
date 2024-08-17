import { Router } from 'express';
import { loginUser, newUser, getUserById, updateUser, deleteUser } from '../controllers/user';
import validateToken from './validate-token';// Asegúrate de importar el middleware

const router = Router();

router.post('/', newUser);
router.post('/login', loginUser);
router.get('/profile', validateToken, getUserById); // Mostrar el perfil del usuario autenticado
router.put('/profile', validateToken, updateUser); // Editar el perfil del usuario autenticado
router.delete('/profile', validateToken, deleteUser); // Eliminar el usuario autenticado

export default router;
