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
const order_1 = __importDefault(require("../models/order"));
const OrderItem_1 = __importDefault(require("../models/OrderItem")); // Importa el modelo OrderItem
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Configura PayPal con tus credenciales
paypal_rest_sdk_1.default.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_CLIENT_ID || 'AbamjI9Ap1Lh9fVuxJbJyRLyZEX5tx16OnqcxryaX9pGNRMNBRVfnW-OpKAUe_o3LiFBnLU2Tv38xlM7',
    client_secret: process.env.PAYPAL_CLIENT_SECRET || 'EEhh4Y8LJdkb6TZjO2YXf3rh3tz349aQR7TFUuzcCn0mUQkDsSUNQg_qiwGMb056iG8sFFcDDAVLZvv2',
});
// Crear una transacción de PayPal
const createPayPalTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.cookies.authToken || ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]); // Obtener token de la cookie o del encabezado de autorización
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
        const total = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2);
        const createPaymentJson = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: `http://localhost:${process.env.PORT}/api/paypal/success`,
                cancel_url: `http://localhost:${process.env.PORT}/api/paypal/cancel`,
            },
            transactions: [{
                    item_list: { items },
                    amount: {
                        currency: 'MXN',
                        total,
                    },
                    description: 'Compra del carrito de compras',
                }],
        };
        paypal_rest_sdk_1.default.payment.create(createPaymentJson, (error, payment) => {
            var _a, _b;
            if (error) {
                console.error('PayPal Error:', error.response);
                return res.status(500).json({ msg: 'Error al crear la transacción de PayPal', details: error.response });
            }
            const approvalUrl = (_b = (_a = payment.links) === null || _a === void 0 ? void 0 : _a.find(link => link.rel === 'approval_url')) === null || _b === void 0 ? void 0 : _b.href;
            if (approvalUrl) {
                res.status(200).json({ approvalUrl });
            }
            else {
                res.status(500).json({ msg: 'No se pudo obtener la URL de aprobación de PayPal.' });
            }
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
    var _a;
    const { paymentId, PayerID } = req.query;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.authToken;
    if (!token) {
        return res.status(401).json({ msg: 'Token no proporcionado' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || 'pepito123');
        const userId = decoded.id;
        const executePaymentJson = {
            payer_id: PayerID,
        };
        paypal_rest_sdk_1.default.payment.execute(paymentId, executePaymentJson, (error, payment) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                console.error('PayPal Execution Error:', error);
                return res.redirect(`http://localhost:8100/pago-exitoso?status=error`); // Redirige al frontend con estado de error
            }
            try {
                const userCart = yield UserCart_1.default.findOne({
                    where: { userId },
                    include: [{
                            model: CartItem_1.default,
                            as: 'items',
                            include: [product_1.Product],
                        }],
                });
                if (!userCart || !userCart.items) {
                    console.error('Carrito no encontrado después del pago');
                    return res.redirect(`http://localhost:8100/pago-exitoso?status=error`); // Redirige al frontend con estado de error
                }
                let totalAmount = 0;
                const orderItems = [];
                for (const item of userCart.items) {
                    if (!item.product) {
                        console.error(`Product not found for CartItem with ID ${item.id}`);
                        throw new Error(`Product not found for CartItem with ID ${item.id}`);
                    }
                    item.product.existencia -= item.quantity;
                    yield item.product.save();
                    totalAmount += item.quantity * item.product.precio;
                    orderItems.push({
                        orderId: 0, // Se actualizará más adelante
                        productId: item.product.id,
                        quantity: item.quantity,
                        price: item.product.precio,
                    });
                    yield item.destroy();
                }
                // Guardar la orden en la base de datos
                const order = yield order_1.default.create({
                    userId: userId,
                    totalAmount: totalAmount,
                    status: 'Completed',
                    paymentId: (payment === null || payment === void 0 ? void 0 : payment.id) || '',
                });
                // Actualizar orderId en cada orderItem y guardarlos en la base de datos
                yield OrderItem_1.default.bulkCreate(orderItems.map(item => (Object.assign(Object.assign({}, item), { orderId: order.id }))));
                res.redirect(`http://localhost:8100/pago-exitoso?status=success`); // Redirige al frontend con estado de éxito
            }
            catch (error) {
                console.error('Error al procesar el pago de PayPal:', error);
                res.redirect(`http://localhost:8100/pago-exitoso?status=error`); // Redirige al frontend con estado de error
            }
        }));
    }
    catch (error) {
        console.error('Error al verificar el token:', error);
        return res.redirect(`http://localhost:8100/pago-exitoso?status=error`); // Redirige al frontend con estado de error
    }
});
exports.successPayPalTransaction = successPayPalTransaction;
// Manejar la cancelación de la transacción de PayPal
const cancelPayPalTransaction = (req, res) => {
    res.redirect('http://localhost:8100/pago-cancelado'); // Redirige al frontend para manejar la cancelación
};
exports.cancelPayPalTransaction = cancelPayPalTransaction;
