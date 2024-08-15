import { Request, Response } from 'express';
import UserCart from '../models/UserCart';
import CartItem from '../models/CartItem';
import { Product } from '../models/product';

// Función para agregar al carrito
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
        let userCart = await UserCart.findOne({ where: { userId } });

        if (!userCart) {
            // Si no existe, crear uno nuevo
            userCart = await UserCart.create({ userId });
        }

        // Verificar si el producto ya está en el carrito
        let cartItem = await CartItem.findOne({
            where: { userCartId: userCart.id, productId }
        });

        if (cartItem) {
            // Si el producto ya está en el carrito, actualizar la cantidad
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            // Si el producto no está en el carrito, agregarlo
            cartItem = await CartItem.create({
                userCartId: userCart.id,
                productId,
                quantity
                
            });
        }
        console.log(`Usuario ID: ${req.userId} está agregando un producto al carrito.`);

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

// Función para obtener los items del carrito
export const getCartItems = async (req: Request, res: Response) => {
    const userId = req.userId; // Esto debería venir del middleware de validación de token

    try {
        // Buscar el carrito específico del usuario logueado usando userId
        const userCart = await UserCart.findOne({
            where: { userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }]
        });

        if (!userCart) {
            return res.status(404).json({
                msg: 'Carrito no encontrado'
            });
        }

        res.status(200).json({ data: userCart });

    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({
            msg: 'Ocurrió un error al obtener el carrito'
        });
    }
};

// Función para eliminar un producto del carrito
export const removeFromCart = async (req: Request, res: Response) => {
    const { id } = req.params; // Asegúrate de obtener el id correctamente
    const userId = req.userId; // Obtenido del token

    if (!id) {
        return res.status(400).json({ msg: 'ID de producto no proporcionado' });
    }

    try {
        // Buscar el carrito del usuario
        const userCart = await UserCart.findOne({ where: { userId } });
        
        if (!userCart) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }

        // Buscar el producto en el carrito
        const cartItem = await CartItem.findOne({
            where: {
                userCartId: userCart.id,
                productId: id
            }
        });

        if (!cartItem) {
            return res.status(404).json({ msg: 'Producto no encontrado en el carrito' });
        }

        // Eliminar el producto del carrito
        await cartItem.destroy();

        res.status(200).json({ msg: 'Producto eliminado del carrito correctamente' });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ msg: 'Error al eliminar el producto del carrito' });
    }
};


