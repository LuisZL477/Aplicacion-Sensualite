import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import paypal from '@paypal/checkout-server-sdk';
import Pago from '../models/payment'; // Ajusta la ruta según tu estructura de carpetas

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configuración de PayPal
const environment = new paypal.core.SandboxEnvironment('YOUR_PAYPAL_CLIENT_ID', 'YOUR_PAYPAL_CLIENT_SECRET');
const client = new paypal.core.PayPalHttpClient(environment);

// Endpoint para generar pago con PayPal
app.post('/create-paypal-payment', async (req, res) => {
    const { amount, compras_id_compra, compras_usuarios_idusuario } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
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
        const order = await client.execute(request);

        // Guarda el pago en la base de datos
        const nuevoPago = await Pago.create({
            tipopago: 'PayPal',
            compras_id_compra,
            compras_usuarios_idusuario
        });

        res.status(200).json({
            order: order.result,
            paymentRecord: nuevoPago
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
