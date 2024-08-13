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
exports.addToCart = void 0;
const cart_1 = require("../models/cart");
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Obtenido del token
    const { productId, quantity } = req.body;
    if (!userId) {
        return res.status(400).json({
            msg: 'User ID no está disponible en la solicitud'
        });
    }
    if (!productId || quantity == null) {
        return res.status(400).json({
            msg: 'Faltan datos en la solicitud'
        });
    }
    try {
        // Verificar si el carrito del usuario ya existe
        let cart = yield cart_1.Cart.findOne({ where: { userId: userId } });
        if (!cart) {
            // Si no existe, crear uno nuevo
            cart = yield cart_1.Cart.create({ userId: userId });
        }
        // Verificar si el producto ya está en el carrito
        let cartItem = yield cart_1.CartItem.findOne({
            where: { cartId: cart.id, productId: productId }
        });
        if (cartItem) {
            // Si el producto ya está en el carrito, actualizar la cantidad
            cartItem.quantity += quantity; // Asegúrate de que quantity es un número
            yield cartItem.save();
        }
        else {
            // Si el producto no está en el carrito, agregarlo
            cartItem = yield cart_1.CartItem.create({
                cartId: cart.id,
                productId: productId,
                quantity: quantity
            });
        }
        res.status(200).json({
            msg: 'Producto agregado al carrito correctamente',
            cartItem
        });
    }
    catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({
            msg: 'Ocurrió un error al agregar el producto al carrito'
        });
    }
});
exports.addToCart = addToCart;
