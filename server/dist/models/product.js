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
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const { Category } = require('./categoria');
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
    },
    categoriaId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'categorias', // Nombre de la tabla de categorías
            key: 'id'
        }
    }
}, {
    timestamps: false,
    tableName: 'productos'
});
// Hook para registrar la categoría cuando se establece el campo 'tipo'
exports.Product.beforeUpdate((product) => __awaiter(void 0, void 0, void 0, function* () {
    if (product.tipo) {
        const [category, created] = yield Category.findOrCreate({
            where: { nombre: product.tipo },
            defaults: { nombre: product.tipo }
        });
        product.tipo = category.nombre;
    }
}));
