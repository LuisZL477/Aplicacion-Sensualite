import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const headerToken = req.headers['authorization'];

    if (headerToken != undefined && headerToken.startsWith('Bearer ')) {
        try {
            const bearerToken = headerToken.slice(7);
            const decoded: any = jwt.verify(bearerToken, process.env.SECRET_KEY || 'pepito123');
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
