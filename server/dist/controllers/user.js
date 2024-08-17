"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.loginUser = exports.newUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, password, apellido, edad, correo, domicilio, telefono } = req.body;
    // Validamos si el usuario existe en la base de datos
    const user = yield user_1.default.findOne({ where: { correo: correo } });
    if (user) {
        return res.status(400).json({
            msg: `El correo ${correo} ya ha sido registrado`
        });
    }
    const hashedpassword = yield bcrypt_1.default.hash(password, 10);
    try {
        // Guardamos usuario en la base de datos
        yield user_1.default.create({
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
    }
    catch (error) {
        res.status(400).json({
            msg: 'Ocurrió un error',
            error
        });
    }
});
exports.newUser = newUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, password } = req.body;
    // Validamos si el usuario existe en la base de datos
    const user = yield user_1.default.findOne({ where: { correo: correo } });
    if (!user) {
        return res.status(400).json({
            msg: `No existe un usuario con el correo ${correo} en la base de datos`
        });
    }
    // Validamos password 
    const passwordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!passwordValid) {
        return res.status(400).json({
            msg: `Password incorrecta`
        });
    }
    // Generamos token
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        correo: correo
    }, process.env.SECRET_KEY || 'pepito123');
    res.json(token);
});
exports.loginUser = loginUser;
// Mostrar un usuario por su ID (extraído del token)
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const user = yield user_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ msg: 'Error al obtener el usuario.', error });
    }
});
exports.getUserById = getUserById;
// Editar usuario
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { nombre, apellido, edad, correo, domicilio, telefono } = req.body;
    try {
        const user = yield user_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }
        yield user.update({ nombre, apellido, edad, correo, domicilio, telefono });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el usuario.', error });
    }
});
exports.updateUser = updateUser;
// Eliminar usuario
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const user = yield user_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }
        yield user.destroy();
        res.json({ msg: 'Usuario eliminado exitosamente.' });
    }
    catch (error) {
        res.status(500).json({ msg: 'Error al eliminar el usuario.', error });
    }
});
exports.deleteUser = deleteUser;
