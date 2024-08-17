"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const validate_token_1 = __importDefault(require("./validate-token")); // Asegúrate de importar el middleware
const router = (0, express_1.Router)();
router.post('/', user_1.newUser);
router.post('/login', user_1.loginUser);
router.get('/profile', validate_token_1.default, user_1.getUserById); // Mostrar el perfil del usuario autenticado
router.put('/profile', validate_token_1.default, user_1.updateUser); // Editar el perfil del usuario autenticado
router.delete('/profile', validate_token_1.default, user_1.deleteUser); // Eliminar el usuario autenticado
exports.default = router;
