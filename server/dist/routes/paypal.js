"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_token_1 = __importDefault(require("./validate-token"));
const paypal_1 = require("../controllers/paypal");
const router = (0, express_1.Router)();
router.post('/create', validate_token_1.default, paypal_1.createPayPalTransaction);
router.get('/success', validate_token_1.default, paypal_1.successPayPalTransaction);
router.get('/cancel', paypal_1.cancelPayPalTransaction);
exports.default = router;
