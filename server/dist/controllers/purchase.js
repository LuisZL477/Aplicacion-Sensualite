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
exports.getPurchases = exports.createPurchase = void 0;
const purchase_1 = __importDefault(require("../models/purchase"));
const PurchaseItem_1 = __importDefault(require("../models/PurchaseItem")); // Importar el modelo de PurchaseItem
const UserCart_1 = __importDefault(require("../models/UserCart"));
const CartItem_1 = __importDefault(require("../models/CartItem"));
const product_1 = require("../models/product");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createPurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.cookies.authToken || ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
    if (!token) {
        return res.status(401).json({ msg: 'Token no encontrado' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || 'pepito123');
        const userId = decoded.id;
        const userCart = yield UserCart_1.default.findOne({
            where: { userId },
            include: [{
                    model: CartItem_1.default,
                    as: 'items',
                    include: [{ model: product_1.Product, as: 'product' }],
                }],
        });
        if (!userCart || !userCart.items || userCart.items.length === 0) {
            return res.status(404).json({ msg: 'Carrito no encontrado o vacío' });
        }
        const total = userCart.items.reduce((sum, item) => {
            if (!item.product) {
                throw new Error(`Producto no encontrado para el CartItem con ID ${item.id}`);
            }
            return sum + item.product.precio * item.quantity;
        }, 0);
        const purchase = yield purchase_1.default.create({
            userId,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            correo: req.body.correo,
            domicilio: req.body.domicilio,
            telefono: req.body.telefono,
            total,
        });
        for (const item of userCart.items) {
            // Crear el PurchaseItem manualmente
            yield PurchaseItem_1.default.create({
                purchaseId: purchase.id,
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.precio,
            });
            item.product.existencia -= item.quantity;
            yield item.product.save();
            yield item.destroy();
        }
        res.status(201).json({ msg: 'Compra registrada exitosamente', purchase });
    }
    catch (error) {
        console.error('Error al registrar la compra:', error);
        res.status(500).json({ msg: 'Ocurrió un error al registrar la compra' });
    }
});
exports.createPurchase = createPurchase;
// Mostrar todas las compras del usuario autenticado
const getPurchases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.cookies.authToken || ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
    if (!token) {
        return res.status(401).json({ msg: 'Token no encontrado' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || 'pepito123');
        const userId = decoded.id;
        const purchases = yield purchase_1.default.findAll({
            where: { userId },
            include: [{
                    model: PurchaseItem_1.default,
                    as: 'items',
                    include: [{ model: product_1.Product, as: 'product' }]
                }]
        });
        if (!purchases || purchases.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron compras para este usuario' });
        }
        res.status(200).json({ purchases });
    }
    catch (error) {
        console.error('Error al obtener las compras:', error);
        res.status(500).json({ msg: 'Ocurrió un error al obtener las compras' });
    }
});
exports.getPurchases = getPurchases;
