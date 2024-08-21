// UserCart.ts
import { Model, DataTypes, Optional, HasManyGetAssociationsMixin } from 'sequelize';
import sequelize from '../db/connection';
import User from './user';
import CartItem from './CartItem';

// Definición del modelo UserCart
interface UserCartAttributes {
    id: number;
    userId: number;
}

interface UserCartCreationAttributes extends Optional<UserCartAttributes, 'id'> {}

class UserCart extends Model<UserCartAttributes, UserCartCreationAttributes> implements UserCartAttributes {
    public id!: number;
    public userId!: number;

    // Asociación
    public items?: CartItem[]; // Define los items como propiedad opcional
}

UserCart.init({
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
    modelName: 'UserCart',
    tableName: 'Usuario_Carrito',
    timestamps: false
});

// Relación User -> UserCart
User.hasMany(UserCart, { foreignKey: 'userId' });
UserCart.belongsTo(User, { foreignKey: 'userId' });

// Define la relación con CartItem
UserCart.hasMany(CartItem, { foreignKey: 'userCartId', as: 'items' });
CartItem.belongsTo(UserCart, { foreignKey: 'userCartId' });
export default UserCart;

