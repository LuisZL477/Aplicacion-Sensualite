"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
exports.Product = connection_1.default.define('product', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING
    },
    tipo: {
        type: sequelize_1.DataTypes.STRING
    },
    precio: {
        type: sequelize_1.DataTypes.DOUBLE
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING
    },
    existencia: {
        type: sequelize_1.DataTypes.INTEGER
    },
    imagen: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    timestamps: false,
    tableName: 'Productos'
});
