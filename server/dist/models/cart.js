"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItem = exports.Cart = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const user_1 = __importDefault(require("./user"));
const product_1 = require("./product"); // Asegúrate de que Product esté correctamente importado
class Cart extends sequelize_1.Model {
}
exports.Cart = Cart;
Cart.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user_1.default,
            key: 'id'
        }
    }
}, {
    sequelize: connection_1.default,
    modelName: 'Cart',
    tableName: 'carritos',
    timestamps: false
});
class CartItem extends sequelize_1.Model {
}
exports.CartItem = CartItem;
CartItem.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cartId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cart,
            key: 'id'
        }
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: product_1.Product, // Asegúrate de que esta referencia sea correcta
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
    tableName: 'carrito_compras',
    timestamps: false
});
// Definición de relaciones entre los modelos
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
product_1.Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });
CartItem.belongsTo(product_1.Product, { foreignKey: 'productId', as: 'product' });
