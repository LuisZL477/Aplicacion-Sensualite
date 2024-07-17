import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export interface ProductInstance extends Model {
  id: number;
  nombre: string;
  tipo: string;
  precio: number;
  descripcion: string;
  existencia: number;
  imagen: string;
}

export const Product = sequelize.define<ProductInstance>('product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING
  },
  tipo: {
    type: DataTypes.STRING
  },
  precio: {
    type: DataTypes.DOUBLE
  },
  descripcion: {
    type: DataTypes.STRING
  },
  existencia: {
    type: DataTypes.INTEGER
  },
  imagen: {
    type: DataTypes.STRING
  }
}, {
  timestamps: false,
  tableName: 'Productos'
});
