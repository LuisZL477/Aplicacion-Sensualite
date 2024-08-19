"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection")); // Asegúrate de ajustar la ruta a tu configuración de Sequelize
class Pago extends sequelize_1.Model {
}
Pago.init({
    idpago: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    tipopago: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    compras_id_compra: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'compras', // Nombre de la tabla 'compras'
            key: 'id_compra',
        },
    },
    compras_usuarios_idusuario: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios', // Nombre de la tabla 'usuarios'
            key: 'idusuario',
        },
    },
}, {
    sequelize: connection_1.default,
    tableName: 'pagos',
    timestamps: false,
});
exports.default = Pago; // Exporta el modelo
