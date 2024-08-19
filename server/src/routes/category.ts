import { Router } from 'express';
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from '../controllers/category';

const router = Router();

// Rutas para el modelo de categorías
router.post('/', createCategory); // Crear una nueva categoría
router.get('/', getCategories); // Obtener todas las categorías
router.get('/:id', getCategoryById); // Obtener una categoría por ID
router.put('/:id', updateCategory); // Actualizar una categoría por ID
router.delete('/:id', deleteCategory); // Eliminar una categoría por ID

export default router;
