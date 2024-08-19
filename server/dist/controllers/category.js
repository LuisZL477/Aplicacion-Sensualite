"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryById = exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.createCategory = void 0;
const category_1 = require("../models/category"); // Asegúrate de que la ruta sea correcta
const product_1 = require("../models/product");
// Crear una nueva categoría
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre } = req.body;
    try {
        const nuevaCategoria = yield category_1.Category.create({ nombre });
        res.json({
            msg: 'Categoría creada exitosamente',
            categoria: nuevaCategoria
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al crear la categoría',
            error
        });
    }
});
exports.createCategory = createCategory;
// Obtener todas las categorías
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categorias = yield category_1.Category.findAll();
        res.json(categorias);
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al obtener las categorías',
            error
        });
    }
});
exports.getCategories = getCategories;
// Actualizar una categoría por ID
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const categoria = yield category_1.Category.findByPk(id);
        if (!categoria) {
            return res.status(404).json({
                msg: `No existe una categoría con el id ${id}`
            });
        }
        yield categoria.update({ nombre });
        res.json({
            msg: 'Categoría actualizada exitosamente',
            categoria
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al actualizar la categoría',
            error
        });
    }
});
exports.updateCategory = updateCategory;
// Eliminar una categoría por ID
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const categoria = yield category_1.Category.findByPk(id);
        if (!categoria) {
            return res.status(404).json({
                msg: `No existe una categoría con el id ${id}`
            });
        }
        yield categoria.destroy();
        res.json({
            msg: 'Categoría eliminada exitosamente'
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al eliminar la categoría',
            error
        });
    }
});
exports.deleteCategory = deleteCategory;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const category = yield category_1.Category.findByPk(id, {
            include: [{
                    model: product_1.Product,
                    as: 'productos' // Debe coincidir con el alias definido en la asociación
                }]
        });
        if (!category) {
            return res.status(404).json({
                msg: `No existe una categoría con el id ${id}`
            });
        }
        res.json(category);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener la categoría'
        });
    }
});
exports.getCategoryById = getCategoryById;
