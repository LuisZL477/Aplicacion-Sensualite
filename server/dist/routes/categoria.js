"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoria_1 = require("../controllers/categoria");
const router = (0, express_1.Router)();
// Rutas para el modelo de categorías
router.post('/', categoria_1.createCategoria); // Crear una nueva categoría
router.get('/', categoria_1.getCategorias); // Obtener todas las categorías
router.get('/:id', categoria_1.getCategoriaById); // Obtener una categoría por ID
router.put('/:id', categoria_1.updateCategoria); // Actualizar una categoría por ID
router.delete('/:id', categoria_1.deleteCategoria); // Eliminar una categoría por ID
exports.default = router;
