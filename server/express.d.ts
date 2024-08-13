// express.d.ts
import { Request } from 'express';

declare module 'express' {
    export interface Request {
        userId?: number; // O el tipo que corresponda al ID del usuario en tu modelo
    }
}
