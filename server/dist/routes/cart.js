"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_token_1 = __importDefault(require("./validate-token"));
const cart_1 = require("../controllers/cart");
const router = (0, express_1.Router)();
router.post('/', validate_token_1.default, cart_1.addToCart); // Ruta para agregar al carrito
router.get('/', validate_token_1.default, cart_1.getCartItems); // Ruta para obtener los items del carrito
exports.default = router;
