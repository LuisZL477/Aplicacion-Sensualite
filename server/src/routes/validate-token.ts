import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    // Intenta obtener el token desde la cookie primero
    const token = req.cookies?.authToken || req.headers['authorization']?.split(' ')[1];

    if (token) {
        try {
            const decoded: any = jwt.verify(token, process.env.SECRET_KEY || 'pepito123');
            req.userId = decoded.id; // Almacenar el id del usuario en req para usarlo en otras funciones
            next();
        } catch (error) {
            res.status(401).json({
                msg: 'Token no válido'
            });
        }
    } else {
        res.status(401).json({
            msg: "Acceso denegado"
        });
    }
};

export default validateToken;
