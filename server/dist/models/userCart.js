"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const user_1 = __importDefault(require("./user"));
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
    tableName: 'Usuario_Carrito',
    timestamps: false
});
// Relación User -> UserCart
user_1.default.hasMany(UserCart, { foreignKey: 'userId' });
UserCart.belongsTo(user_1.default, { foreignKey: 'userId' });
exports.default = UserCart;
