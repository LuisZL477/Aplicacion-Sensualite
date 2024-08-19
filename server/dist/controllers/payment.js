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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const checkout_server_sdk_1 = __importDefault(require("@paypal/checkout-server-sdk"));
const payment_1 = __importDefault(require("../models/payment")); // Ajusta la ruta según tu estructura de carpetas
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Configuración de PayPal
const environment = new checkout_server_sdk_1.default.core.SandboxEnvironment('YOUR_PAYPAL_CLIENT_ID', 'YOUR_PAYPAL_CLIENT_SECRET');
const client = new checkout_server_sdk_1.default.core.PayPalHttpClient(environment);
// Endpoint para generar pago con PayPal
app.post('/create-paypal-payment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, compras_id_compra, compras_usuarios_idusuario } = req.body;
    const request = new checkout_server_sdk_1.default.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: amount
                },
                description: 'Descripción del producto'
            }],
    });
    try {
        const order = yield client.execute(request);
        // Guarda el pago en la base de datos
        const nuevoPago = yield payment_1.default.create({
            tipopago: 'PayPal',
            compras_id_compra,
            compras_usuarios_idusuario
        });
        res.status(200).json({
            order: order.result,
            paymentRecord: nuevoPago
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
