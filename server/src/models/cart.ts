import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../db/connection';
import User from './user';
import { Product } from './product';  // Asegúrate de que Product esté correctamente importado

// Definición del modelo Cart
interface CartAttributes {
    id: number;
    userId: number;
}

interface CartCreationAttributes extends Optional<CartAttributes, 'id'> {}

class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
    public id!: number;
    public userId!: number;
}

Cart.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Cart',
    tableName: 'carritos',
    timestamps: false
});

// Definición del modelo CartItem
interface CartItemAttributes {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, 'id'> {}

class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
    public id!: number;
    public cartId!: number;
    public productId!: number;
    public quantity!: number;
}

CartItem.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cart,
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product, // Asegúrate de que esta referencia sea correcta
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
    tableName: 'carrito_compras',
    timestamps: false
});

// Definición de relaciones entre los modelos
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

export { Cart, CartItem };


