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
exports.cancelPayPalTransaction = exports.successPayPalTransaction = exports.createPayPalTransaction = void 0;
const paypal_rest_sdk_1 = __importDefault(require("paypal-rest-sdk"));
const UserCart_1 = __importDefault(require("../models/UserCart"));
const CartItem_1 = __importDefault(require("../models/CartItem"));
const product_1 = require("../models/product");
// Configura PayPal con tus credenciales
paypal_rest_sdk_1.default.configure({
    mode: 'sandbox', // Cambia a 'live' para producción
    client_id: process.env.PAYPAL_CLIENT_ID || 'midnqwijduidweygfdhc',
    client_secret: process.env.PAYPAL_CLIENT_SECRET || '36ed87wdcibcte2r6127ey2quibqsddxwc',
});
// Crear una transacción de PayPal
const createPayPalTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
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
        const items = userCart.items.map((item) => {
            if (!item.product) {
                throw new Error(`Product not found for CartItem with ID ${item.id}`);
            }
            return {
                name: item.product.nombre,
                sku: item.product.id.toString(),
                price: item.product.precio.toFixed(2),
                currency: 'MXN',
                quantity: item.quantity,
            };
        });
        const total = items.reduce((sum, item) => {
            return sum + parseFloat(item.price) * item.quantity;
        }, 0).toFixed(2);
        const createPaymentJson = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: `${process.env.BASE_URL}/api/paypal/success`,
                cancel_url: `${process.env.BASE_URL}/api/paypal/cancel`,
            },
            transactions: [{
                    item_list: {
                        items,
                    },
                    amount: {
                        currency: 'USD',
                        total,
                    },
                    description: 'Compra del carrito de compras',
                }],
        };
        paypal_rest_sdk_1.default.payment.create(createPaymentJson, (error, payment) => {
            var _a, _b;
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Error al crear la transacción de PayPal' });
            }
            const approvalUrl = (_b = (_a = payment.links) === null || _a === void 0 ? void 0 : _a.find(link => link.rel === 'approval_url')) === null || _b === void 0 ? void 0 : _b.href;
            res.status(200).json({ approvalUrl });
        });
    }
    catch (error) {
        console.error('Error al crear la transacción de PayPal:', error);
        res.status(500).json({ msg: 'Ocurrió un error al crear la transacción de PayPal' });
    }
});
exports.createPayPalTransaction = createPayPalTransaction;
// Manejar el éxito de la transacción de PayPal
const successPayPalTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentId, PayerID } = req.query;
    const executePaymentJson = {
        payer_id: PayerID,
    };
    paypal_rest_sdk_1.default.payment.execute(paymentId, executePaymentJson, (error, payment) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            console.error(error.response);
            return res.status(500).json({ msg: 'Error al completar la transacción de PayPal' });
        }
        try {
            const userId = req.userId;
            const userCart = yield UserCart_1.default.findOne({
                where: { userId },
                include: [{
                        model: CartItem_1.default,
                        as: 'items',
                        include: [product_1.Product],
                    }],
            });
            if (!userCart || !userCart.items) {
                return res.status(404).json({ msg: 'Carrito no encontrado' });
            }
            for (const item of userCart.items) {
                if (!item.product) {
                    throw new Error(`Product not found for CartItem with ID ${item.id}`);
                }
                item.product.existencia -= item.quantity;
                yield item.product.save();
                yield item.destroy();
            }
            res.status(200).json({ msg: 'Compra realizada con éxito' });
        }
        catch (error) {
            console.error('Error al procesar el pago de PayPal:', error);
            res.status(500).json({ msg: 'Ocurrió un error al procesar el pago de PayPal' });
        }
    }));
});
exports.successPayPalTransaction = successPayPalTransaction;
// Manejar la cancelación de la transacción de PayPal
const cancelPayPalTransaction = (req, res) => {
    res.status(200).json({ msg: 'Transacción de PayPal cancelada' });
};
exports.cancelPayPalTransaction = cancelPayPalTransaction;
