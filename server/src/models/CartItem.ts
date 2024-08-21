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

    // Asociación
    public product?: InstanceType<typeof Product>; // Usar InstanceType para la relación con el producto
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

// Relación CartItem -> Product
CartItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(CartItem, { foreignKey: 'productId' });
export default CartItem;
