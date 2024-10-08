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
exports.loginUser = exports.newUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const login_User_1 = __importDefault(require("../models/login_User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, last_name, age, email, address, tel } = req.body;
    // Validamos si el usuario existe en la base de datos
    const user = yield login_User_1.default.findOne({ where: { email: email } });
    if (user) {
        return res.status(400).json({
            msg: `El correo ${email} ya ha sido registrado`
        });
    }
    const hashedpassword = yield bcrypt_1.default.hash(password, 10);
    try {
        //Guardamos usuario en la base de datos
        yield login_User_1.default.create({
            username: username,
            last_name: last_name,
            age: age,
            email: email,
            password: hashedpassword,
            address: address,
            tel: tel
        });
        res.json({
            msg: `Usuario ${username} creado exitosamente`,
        });
    }
    catch (error) {
        res.status(400).json({
            msg: 'Ocurrio un error',
            error
        });
    }
});
exports.newUser = newUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Validamos si el usuario existe en ña base de datos
    const user = yield login_User_1.default.findOne({ where: { email: email } });
    if (!user) {
        return res.status(400).json({
            msg: `No existe un usuario con el nombre ${email} en la base de datos`
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
        email: email
    }, process.env.SECRET_KEY || 'pepito123');
    res.json(token);
});
exports.loginUser = loginUser;
