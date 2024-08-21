"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const UserCart_1 = __importDefault(require("./UserCart"));
const product_1 = require("./product");
class CartItem extends sequelize_1.Model {
}
CartItem.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userCartId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserCart_1.default,
            key: 'id'
        }
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: product_1.Product,
            key: 'id'
        }
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize: connection_1.default,
    modelName: 'CartItem',
    tableName: 'Carrito',
    timestamps: false
});
// Relación CartItem -> Product
CartItem.belongsTo(product_1.Product, { foreignKey: 'productId' });
product_1.Product.hasMany(CartItem, { foreignKey: 'productId' });
exports.default = CartItem;
