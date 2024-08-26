import { Request, Response } from 'express';
import Order from '../models/order';
import OrderItem from '../models/OrderItem';
import { Product } from '../models/product';
import jwt from 'jsonwebtoken';

// Middleware para verificar el token y obtener el ID del usuario
const getUserIdFromToken = (req: Request): number | null => {
    const token = req.cookies.authToken || req.headers['authorization']?.split(' ')[1];
    if (!token) return null;

    try {
        const decoded: any = jwt.verify(token, process.env.SECRET_KEY || 'pepito123');
        return decoded.id;
    } catch (error) {
        return null;
    }
};

// Controlador para obtener las compras del usuario logueado
export const getUserOrders = async (req: Request, res: Response) => {
    const userId = getUserIdFromToken(req);

    if (!userId) {
        return res.status(401).json({ msg: 'Token no válido o no proporcionado' });
    }

    try {
        const orders = await Order.findAll({
            where: { userId },
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{ model: Product, as: 'product' }],
            }],
        });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron órdenes para este usuario' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error al obtener las órdenes del usuario:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};
