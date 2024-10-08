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
exports.buyProduct = exports.getProduct = exports.getProducts = void 0;
const product_1 = require("../models/product");
// Obtener todos los productos
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listProducts = yield product_1.Product.findAll();
        res.json(listProducts);
    }
    catch (error) {
        res.status(500).json({ msg: 'Error al obtener los productos', error });
    }
});
exports.getProducts = getProducts;
// Obtener un producto por id
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield product_1.Product.findByPk(id);
        if (product) {
            res.json(product);
        }
        else {
            res.status(404).json({ msg: `No existe un producto con el id ${id}` });
        }
    }
    catch (error) {
        res.status(500).json({ msg: 'Error al obtener el producto', error });
    }
});
exports.getProduct = getProduct;
// Comprar un producto
const buyProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = req.body;
    if (!quantity || quantity <= 0) {
        return res.status(400).json({ msg: 'La cantidad debe ser un número positivo' });
    }
    try {
        const product = yield product_1.Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ msg: `No existe un producto con el id ${productId}` });
        }
        if (product.existencia >= quantity) {
            product.existencia -= quantity;
            yield product.save();
            res.json({ msg: `Compra realizada con éxito de ${quantity} unidad(es)`, product });
        }
        else {
            res.status(400).json({ msg: 'Stock insuficiente' });
        }
    }
    catch (error) {
        console.error('Error al comprar el producto:', error);
        res.status(500).json({ msg: 'Error interno del servidor', error });
    }
});
exports.buyProduct = buyProduct;
