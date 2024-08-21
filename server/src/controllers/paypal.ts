import { Request, Response } from 'express';
import paypal from 'paypal-rest-sdk';
import UserCart from '../models/UserCart';
import CartItem from '../models/CartItem';
import { Product } from '../models/product';

// Configura PayPal con tus credenciales
paypal.configure({
  mode: 'sandbox', // Cambia a 'live' para producción
  client_id: process.env.PAYPAL_CLIENT_ID || 'midnqwijduidweygfdhc',
  client_secret: process.env.PAYPAL_CLIENT_SECRET || '36ed87wdcibcte2r6127ey2quibqsddxwc',
});

// Extiende la interfaz UserCart para incluir 'items'
interface UserCartWithItems extends UserCart {
  items: CartItem[];
}

// Crear una transacción de PayPal
export const createPayPalTransaction = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
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

    const total = items.reduce((sum: number, item: { price: string; quantity: number }) => {
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

    paypal.payment.create(createPaymentJson, (error, payment) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error al crear la transacción de PayPal' });
      }

      const approvalUrl = payment.links?.find(link => link.rel === 'approval_url')?.href;
      res.status(200).json({ approvalUrl });
    });
  } catch (error) {
    console.error('Error al crear la transacción de PayPal:', error);
    res.status(500).json({ msg: 'Ocurrió un error al crear la transacción de PayPal' });
  }
};

// Manejar el éxito de la transacción de PayPal
export const successPayPalTransaction = async (req: Request, res: Response) => {
  const { paymentId, PayerID } = req.query;

  const executePaymentJson = {
    payer_id: PayerID as string,
  };

  paypal.payment.execute(paymentId as string, executePaymentJson, async (error, payment) => {
    if (error) {
      console.error(error.response);
      return res.status(500).json({ msg: 'Error al completar la transacción de PayPal' });
    }

    try {
      const userId = req.userId;
      const userCart = await UserCart.findOne({
        where: { userId },
        include: [{
          model: CartItem,
          as: 'items',
          include: [Product],
        }],
      }) as UserCartWithItems;

      if (!userCart || !userCart.items) {
        return res.status(404).json({ msg: 'Carrito no encontrado' });
      }

      for (const item of userCart.items) {
        if (!item.product) {
          throw new Error(`Product not found for CartItem with ID ${item.id}`);
        }
        item.product.existencia -= item.quantity;
        await item.product.save();
        await item.destroy();
      }

      res.status(200).json({ msg: 'Compra realizada con éxito' });
    } catch (error) {
      console.error('Error al procesar el pago de PayPal:', error);
      res.status(500).json({ msg: 'Ocurrió un error al procesar el pago de PayPal' });
    }
  });
};

// Manejar la cancelación de la transacción de PayPal
export const cancelPayPalTransaction = (req: Request, res: Response) => {
  res.status(200).json({ msg: 'Transacción de PayPal cancelada' });
};
