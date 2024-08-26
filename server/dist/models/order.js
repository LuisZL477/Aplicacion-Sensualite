"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const user_1 = __importDefault(require("./user"));
const OrderItem_1 = __importDefault(require("./OrderItem")); // Importación del modelo OrderItem
class Order extends sequelize_1.Model {
}
Order.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user_1.default,
            key: 'id',
        },
    },
    totalAmount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    paymentId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: connection_1.default,
    modelName: 'Order',
    tableName: 'pedido',
    timestamps: true,
});
// Relación con User
user_1.default.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(user_1.default, { foreignKey: 'userId' });
// Relación con OrderItem
Order.hasMany(OrderItem_1.default, { foreignKey: 'orderId', as: 'items' });
OrderItem_1.default.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
exports.default = Order;
