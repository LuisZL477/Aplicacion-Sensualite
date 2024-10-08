import { Request, Response } from 'express';
import paypal from 'paypal-rest-sdk';
import UserCart from '../models/UserCart';
import CartItem from '../models/CartItem';
import { Product } from '../models/product';
import Order from '../models/order';
import OrderItem from '../models/OrderItem'; // Importa el modelo OrderItem
import jwt from 'jsonwebtoken';

// Configura PayPal con tus credenciales
paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID || 'AbamjI9Ap1Lh9fVuxJbJyRLyZEX5tx16OnqcxryaX9pGNRMNBRVfnW-OpKAUe_o3LiFBnLU2Tv38xlM7',
  client_secret: process.env.PAYPAL_CLIENT_SECRET || 'EEhh4Y8LJdkb6TZjO2YXf3rh3tz349aQR7TFUuzcCn0mUQkDsSUNQg_qiwGMb056iG8sFFcDDAVLZvv2',
});

// Extiende la interfaz UserCart para incluir 'items'
interface UserCartWithItems extends UserCart {
  items: CartItem[];
}

// Crear una transacción de PayPal
export const createPayPalTransaction = async (req: Request, res: Response) => {
  const token = req.cookies.authToken || req.headers['authorization']?.split(' ')[1]; // Obtener token de la cookie o del encabezado de autorización

  if (!token) {
    return res.status(401).json({ msg: 'Token no encontrado' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY || 'pepito123');
    const userId = decoded.id;

    const userCart = await UserCart.findOne({
      where: { userId },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      }],
    }) as UserCartWithItems;

    if (!userCart || !userCart.items || userCart.items.length === 0) {
      return res.status(404).json({ msg: 'Carrito no encontrado o vacío' });
    }

    const items = userCart.items.map((item: CartItem) => {
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

    const total = items.reduce((sum: number, item: { price: string; quantity: number }) =>
      sum + parseFloat(item.price) * item.quantity, 0).toFixed(2);

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

    paypal.payment.create(createPaymentJson, (error, payment) => {
      if (error) {
        console.error('PayPal Error:', error.response);
        return res.status(500).json({ msg: 'Error al crear la transacción de PayPal', details: error.response });
      }

      const approvalUrl = payment.links?.find(link => link.rel === 'approval_url')?.href;
      if (approvalUrl) {
        res.status(200).json({ approvalUrl });
      } else {
        res.status(500).json({ msg: 'No se pudo obtener la URL de aprobación de PayPal.' });
      }
    });
  } catch (error) {
    console.error('Error al crear la transacción de PayPal:', error);
    res.status(500).json({ msg: 'Ocurrió un error al crear la transacción de PayPal' });
  }
};

// Manejar el éxito de la transacción de PayPal
export const successPayPalTransaction = async (req: Request, res: Response) => {
  const { paymentId, PayerID } = req.query;
  const token = req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({ msg: 'Token no proporcionado' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY || 'pepito123');
    const userId = decoded.id;

    const executePaymentJson = {
      payer_id: PayerID as string,
    };

    paypal.payment.execute(paymentId as string, executePaymentJson, async (error, payment) => {
      if (error) {
        console.error('PayPal Execution Error:', error);
        return res.redirect(`http://localhost:8100/pago-exitoso?status=error`); // Redirige al frontend con estado de error
      }

      try {
        const userCart = await UserCart.findOne({
          where: { userId },
          include: [{
            model: CartItem,
            as: 'items',
            include: [Product],
          }],
        }) as UserCartWithItems;

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
          await item.product.save();

          totalAmount += item.quantity * item.product.precio;

          orderItems.push({
            orderId: 0, // Se actualizará más adelante
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.precio,
          });

          await item.destroy();
        }

        // Guardar la orden en la base de datos
        const order = await Order.create({
          userId: userId,
          totalAmount: totalAmount,
          status: 'Completed',
          paymentId: payment?.id || '',
        });

        // Actualizar orderId en cada orderItem y guardarlos en la base de datos
        await OrderItem.bulkCreate(orderItems.map(item => ({ ...item, orderId: order.id })));

        res.redirect(`http://localhost:8100/pago-exitoso?status=success`); // Redirige al frontend con estado de éxito
      } catch (error) {
        console.error('Error al procesar el pago de PayPal:', error);
        res.redirect(`http://localhost:8100/pago-exitoso?status=error`); // Redirige al frontend con estado de error
      }
    });
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.redirect(`http://localhost:8100/pago-exitoso?status=error`); // Redirige al frontend con estado de error
  }
};

// Manejar la cancelación de la transacción de PayPal
export const cancelPayPalTransaction = (req: Request, res: Response) => {
  res.redirect('http://localhost:8100/pago-cancelado'); // Redirige al frontend para manejar la cancelación
};
