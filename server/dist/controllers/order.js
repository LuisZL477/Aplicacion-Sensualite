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
exports.getUserOrders = void 0;
const order_1 = __importDefault(require("../models/order"));
const OrderItem_1 = __importDefault(require("../models/OrderItem"));
const product_1 = require("../models/product");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware para verificar el token y obtener el ID del usuario
const getUserIdFromToken = (req) => {
    var _a;
    const token = req.cookies.authToken || ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
    if (!token)
        return null;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || 'pepito123');
        return decoded.id;
    }
    catch (error) {
        return null;
    }
};
// Controlador para obtener las compras del usuario logueado
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = getUserIdFromToken(req);
    if (!userId) {
        return res.status(401).json({ msg: 'Token no válido o no proporcionado' });
    }
    try {
        const orders = yield order_1.default.findAll({
            where: { userId },
            include: [{
                    model: OrderItem_1.default,
                    as: 'items',
                    include: [{ model: product_1.Product, as: 'product' }],
                }],
        });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron órdenes para este usuario' });
        }
        res.status(200).json(orders);
    }
    catch (error) {
        console.error('Error al obtener las órdenes del usuario:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
});
exports.getUserOrders = getUserOrders;
