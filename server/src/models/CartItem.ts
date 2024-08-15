import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../db/connection';
import UserCart from './UserCart';
import { Product } from './product';

// Definición del modelo CartItem
interface CartItemAttributes {
    id: number;
    userCartId: number;
    productId: number;
    quantity: number;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, 'id'> {}

class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
    public id!: number;
    public userCartId!: number;
    public productId!: number;
    public quantity!: number;
}

CartItem.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userCartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserCart,
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'CartItem',
    tableName: 'Carrito',
    timestamps: false
});

// Relación UserCart -> CartItem
UserCart.hasMany(CartItem, { foreignKey: 'userCartId', as: 'items' });
CartItem.belongsTo(UserCart, { foreignKey: 'userCartId' });

// Relación Product -> CartItem
Product.hasMany(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

export default CartItem;
