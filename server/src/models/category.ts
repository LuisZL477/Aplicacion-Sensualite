import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection';
import { Product } from './product'; // Importa el modelo Product correctamente

export interface CategoryInstance extends Model {
  id: number;
  nombre: string;
}

export const Category = sequelize.define<CategoryInstance>('category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    
  }
}, {
  timestamps: false,
  tableName: 'categorias'
});



Category.hasMany(Product, { foreignKey: 'categoriaId', as: 'productos' });
