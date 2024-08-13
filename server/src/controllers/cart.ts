import { Request, Response } from 'express';
import { Cart, CartItem } from '../models/cart';
import { Product } from '../models/product';

export const addToCart = async (req: Request, res: Response) => {
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
        let cart = await Cart.findOne({ where: { userId: userId } });

        if (!cart) {
            // Si no existe, crear uno nuevo
            cart = await Cart.create({ userId: userId });
        }

        // Verificar si el producto ya está en el carrito
        let cartItem = await CartItem.findOne({
            where: { cartId: cart.id, productId: productId }
        });

        if (cartItem) {
            // Si el producto ya está en el carrito, actualizar la cantidad
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            // Si el producto no está en el carrito, agregarlo
            cartItem = await CartItem.create({
                cartId: cart.id,
                productId: productId,
                quantity: quantity
            });
        }

        res.status(200).json({
            msg: 'Producto agregado al carrito correctamente',
            cartItem
        });

    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({
            msg: 'Ocurrió un error al agregar el producto al carrito'
        });
    }
};

export const getCartItems = async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        // Obtener el carrito del usuario
        const cart = await Cart.findOne({
            where: { userId: userId },
            include: [{ model: CartItem, include: [Product] }]
        });

        if (!cart) {
            return res.status(404).json({
                msg: 'Carrito no encontrado'
            });
        }

        res.status(200).json(cart);

    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({
            msg: 'Ocurrió un error al obtener el carrito'
        });
    }
};
