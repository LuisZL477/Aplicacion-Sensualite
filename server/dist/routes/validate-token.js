"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = (req, res, next) => {
    var _a, _b;
    // Intenta obtener el token desde la cookie primero
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.authToken) || ((_b = req.headers['authorization']) === null || _b === void 0 ? void 0 : _b.split(' ')[1]);
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || 'pepito123');
            req.userId = decoded.id; // Almacenar el id del usuario en req para usarlo en otras funciones
            next();
        }
        catch (error) {
            res.status(401).json({
                msg: 'Token no válido'
            });
        }
    }
    else {
        res.status(401).json({
            msg: "Acceso denegado"
        });
    }
};
exports.default = validateToken;
