"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_1 = require("../controllers/order");
const router = (0, express_1.Router)();
// Ruta para obtener las compras del usuario logueado
router.get('/orders', order_1.getUserOrders);
exports.default = router;
