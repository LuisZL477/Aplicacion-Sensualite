"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_1 = require("../controllers/category");
const router = (0, express_1.Router)();
// Rutas para el modelo de categorías
router.post('/', category_1.createCategory); // Crear una nueva categoría
router.get('/', category_1.getCategories); // Obtener todas las categorías
router.get('/:id', category_1.getCategoryById); // Obtener una categoría por ID
router.put('/:id', category_1.updateCategory); // Actualizar una categoría por ID
router.delete('/:id', category_1.deleteCategory); // Eliminar una categoría por ID
exports.default = router;
