import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import jwt from 'jsonwebtoken';

export const newUser = async (req: Request, res: Response) => {
    const { nombre, password, apellido, edad, correo, domicilio, telefono } = req.body;

    // Validamos si el usuario existe en la base de datos
    const user = await User.findOne({ where: { correo: correo } });

    if (user) {
        return res.status(400).json({
            msg: `El correo ${correo} ya ha sido registrado`
        });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    try {
        // Guardamos usuario en la base de datos
        await User.create({
            nombre: nombre,
            apellido: apellido,
            edad: edad,
            correo: correo,
            password: hashedpassword,
            domicilio: domicilio,
            telefono: telefono
        });

        res.json({
            msg: `Usuario ${nombre} creado exitosamente`,
        });

    } catch (error) {
        res.status(400).json({
            msg: 'Ocurrió un error',
            error
        });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { correo, password } = req.body;

    // Validamos si el usuario existe en la base de datos
    const user: any = await User.findOne({ where: { correo } });

    if (!user) {
        return res.status(400).json({
            msg: `No existe un usuario con el correo ${correo} en la base de datos`
        });
    }

    // Validamos password 
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
        return res.status(400).json({
            msg: `Password incorrecta`
        });
    }

    // Generamos token
    const token = jwt.sign({
        id: user.id,
        correo: correo
    }, process.env.SECRET_KEY || 'pepito123', { expiresIn: '1h' });

    // Guardar el token en una cookie HTTP-only
    res.cookie('authToken', token, {
        httpOnly: true, // Asegura que la cookie no es accesible desde JavaScript en el frontend
        secure: process.env.NODE_ENV === 'production', // Solo enviar cookie sobre HTTPS en producción
        sameSite: 'strict', // Controla cuándo se envía la cookie, ajusta según tus necesidades
        maxAge: 3600000 // 1 hora
    });

    // Devolver el token en la respuesta para almacenarlo en el local storage
    res.json(token );
};

// Otros métodos (getUserById, updateUser, deleteUser) se mantienen igual
// Mostrar un usuario por su ID (extraído del token)
export const getUserById = async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener el usuario.', error });
    }
};

// Editar usuario
export const updateUser = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { nombre, apellido, edad, correo, domicilio, telefono } = req.body;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        await user.update({ nombre, apellido, edad, correo, domicilio, telefono });
        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el usuario.', error });
    }
};

// Eliminar usuario
export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        await user.destroy();
        res.json({ msg: 'Usuario eliminado exitosamente.' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar el usuario.', error });
    }
};
