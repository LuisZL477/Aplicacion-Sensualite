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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyCart = exports.removeFromCart = exports.getCartItems = exports.addToCart = void 0;
const UserCart_1 = __importDefault(require("../models/UserCart"));
const CartItem_1 = __importDefault(require("../models/CartItem"));
const product_1 = require("../models/product");
// Función para agregar al carrito
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { productId, quantity } = req.body;
    if (!userId) {
        return res.status(400).json({ msg: 'User ID no está disponible en la solicitud' });
    }
    if (!productId || quantity == null) {
        return res.status(400).json({ msg: 'Faltan datos en la solicitud' });
    }
    try {
        let userCart = yield UserCart_1.default.findOne({ where: { userId } });
        if (!userCart) {
            userCart = yield UserCart_1.default.create({ userId });
        }
        let cartItem = yield CartItem_1.default.findOne({
            where: { userCartId: userCart.id, productId }
        });
        if (cartItem) {
            cartItem.quantity += quantity;
            yield cartItem.save();
        }
        else {
            cartItem = yield CartItem_1.default.create({ userCartId: userCart.id, productId, quantity });
        }
        console.log(`Usuario ID: ${req.userId} está agregando un producto al carrito.`);
        res.status(200).json({ msg: 'Producto agregado al carrito correctamente', cartItem });
    }
    catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ msg: 'Ocurrió un error al agregar el producto al carrito' });
    }
});
exports.addToCart = addToCart;
// Función para obtener los items del carrito
const getCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const userCart = yield UserCart_1.default.findOne({
            where: { userId },
            include: [{
                    model: CartItem_1.default,
                    as: 'items',
                    include: [{ model: product_1.Product, as: 'product' }]
                }]
        });
        if (!userCart || !userCart.items) {
            return res.status(404).json({ msg: 'Carrito no encontrado o sin items' });
        }
        res.status(200).json({ data: userCart });
    }
    catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ msg: 'Ocurrió un error al obtener el carrito' });
    }
});
exports.getCartItems = getCartItems;
// Función para eliminar un producto del carrito
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.userId;
    if (!id) {
        return res.status(400).json({ msg: 'ID de producto no proporcionado' });
    }
    try {
        const userCart = yield UserCart_1.default.findOne({ where: { userId } });
        if (!userCart) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }
        const cartItem = yield CartItem_1.default.findOne({ where: { userCartId: userCart.id, productId: id } });
        if (!cartItem) {
            return res.status(404).json({ msg: 'Producto no encontrado en el carrito' });
        }
        yield cartItem.destroy();
        res.status(200).json({ msg: 'Producto eliminado del carrito correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ msg: 'Error al eliminar el producto del carrito' });
    }
});
exports.removeFromCart = removeFromCart;
// Función para comprar todos los productos del carrito
const buyCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const userCart = yield UserCart_1.default.findOne({
            where: { userId },
            include: [{
                    model: CartItem_1.default,
                    as: 'items',
                    include: [product_1.Product]
                }]
        });
        if (!userCart || !userCart.items || userCart.items.length === 0) {
            return res.status(404).json({ msg: 'Carrito no encontrado o vacío' });
        }
        for (let item of userCart.items) {
            if (item.product.existencia >= item.quantity) {
                item.product.existencia -= item.quantity;
                yield item.product.save();
                yield item.destroy();
            }
            else {
                return res.status(400).json({ msg: `Stock insuficiente para el producto ${item.product.nombre}` });
            }
        }
        res.status(200).json({ msg: 'Carrito comprado con éxito y vaciado' });
    }
    catch (error) {
        console.error('Error al comprar el carrito:', error);
        res.status(500).json({ msg: 'Ocurrió un error al comprar el carrito' });
    }
});
exports.buyCart = buyCart;
