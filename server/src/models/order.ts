import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../db/connection';
import User from './user';
import OrderItem from './OrderItem'; // Importación del modelo OrderItem

interface OrderAttributes {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  paymentId: string;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public userId!: number;
  public totalAmount!: number;
  public status!: string;
  public paymentId!: string;
}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'pedido',
  timestamps: true,
});

// Relación con User
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Relación con OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

export default Order;

