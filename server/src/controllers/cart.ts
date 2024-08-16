import { Request, Response } from 'express';
import UserCart from '../models/UserCart';
import CartItem from '../models/CartItem';
import { ProductInstance, Product } from '../models/product';

// Extender la interfaz para incluir la propiedad `items` y `product`
interface CartItemWithProduct extends CartItem {
    product: ProductInstance;
}

interface UserCartWithItems extends UserCart {
    items: CartItemWithProduct[];
}

// Función para agregar al carrito
export const addToCart = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { productId, quantity } = req.body;

    if (!userId) {
        return res.status(400).json({ msg: 'User ID no está disponible en la solicitud' });
    }

    if (!productId || quantity == null) {
        return res.status(400).json({ msg: 'Faltan datos en la solicitud' });
    }

    try {
        let userCart = await UserCart.findOne({ where: { userId } });

        if (!userCart) {
            userCart = await UserCart.create({ userId });
        }

        let cartItem = await CartItem.findOne({
            where: { userCartId: userCart.id, productId }
        });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({ userCartId: userCart.id, productId, quantity });
        }

        console.log(`Usuario ID: ${req.userId} está agregando un producto al carrito.`);
        res.status(200).json({ msg: 'Producto agregado al carrito correctamente', cartItem });
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ msg: 'Ocurrió un error al agregar el producto al carrito' });
    }
};

// Función para obtener los items del carrito
export const getCartItems = async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const userCart = await UserCart.findOne({
            where: { userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{ model: Product, as: 'product' }]
            }]
        }) as UserCartWithItems;

        if (!userCart || !userCart.items) {
            return res.status(404).json({ msg: 'Carrito no encontrado o sin items' });
        }

        res.status(200).json({ data: userCart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ msg: 'Ocurrió un error al obtener el carrito' });
    }
};

// Función para eliminar un producto del carrito
export const removeFromCart = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;

    if (!id) {
        return res.status(400).json({ msg: 'ID de producto no proporcionado' });
    }

    try {
        const userCart = await UserCart.findOne({ where: { userId } });

        if (!userCart) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }

        const cartItem = await CartItem.findOne({ where: { userCartId: userCart.id, productId: id } });

        if (!cartItem) {
            return res.status(404).json({ msg: 'Producto no encontrado en el carrito' });
        }

        await cartItem.destroy();
        res.status(200).json({ msg: 'Producto eliminado del carrito correctamente' });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ msg: 'Error al eliminar el producto del carrito' });
    }
};

// Función para comprar todos los productos del carrito
export const buyCart = async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const userCart = await UserCart.findOne({
            where: { userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [Product]
            }]
        }) as UserCartWithItems;

        if (!userCart || !userCart.items || userCart.items.length === 0) {
            return res.status(404).json({ msg: 'Carrito no encontrado o vacío' });
        }

        for (let item of userCart.items) {
            if (item.product.existencia >= item.quantity) {
                item.product.existencia -= item.quantity;
                await item.product.save();
                await item.destroy();
            } else {
                return res.status(400).json({ msg: `Stock insuficiente para el producto ${item.product.nombre}` });
            }
        }

        res.status(200).json({ msg: 'Carrito comprado con éxito y vaciado' });
    } catch (error) {
        console.error('Error al comprar el carrito:', error);
        res.status(500).json({ msg: 'Ocurrió un error al comprar el carrito' });
    }
};
