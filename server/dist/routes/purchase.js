"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const purchase_1 = require("../controllers/purchase");
const validate_token_1 = __importDefault(require("./validate-token"));
const router = (0, express_1.Router)();
router.post('/purchase', validate_token_1.default, purchase_1.createPurchase);
router.get('/purchase', validate_token_1.default, purchase_1.getPurchases); // Ruta para mostrar las compras
exports.default = router;
