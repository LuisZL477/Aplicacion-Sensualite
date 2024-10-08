"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const user_1 = __importDefault(require("./user"));
const product_1 = require("./product");
const cartItem_1 = __importDefault(require("./cartItem"));
class UserCart extends sequelize_1.Model {
}
UserCart.init({
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
    modelName: 'UserCart',
    tableName: 'user_carts',
    timestamps: false
});
// Definición de relaciones entre los modelos
// Relación User -> UserCart
user_1.default.hasMany(UserCart, { foreignKey: 'userId' });
UserCart.belongsTo(user_1.default, { foreignKey: 'userId' });
// Relación UserCart -> CartItem
UserCart.hasMany(cartItem_1.default, { foreignKey: 'userCartId', as: 'items' });
cartItem_1.default.belongsTo(UserCart, { foreignKey: 'userCartId' });
// Relación Product -> CartItem
product_1.Product.hasMany(cartItem_1.default, { foreignKey: 'productId' });
cartItem_1.default.belongsTo(product_1.Product, { foreignKey: 'productId' });
exports.default = UserCart;
