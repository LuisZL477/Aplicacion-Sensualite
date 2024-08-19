import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/connection';
const{ Category } = require ('./categoria');

export interface ProductInstance extends Model {
  id: number;
  nombre: string;
  tipo: string;
  precio: number;
  descripcion: string;
  existencia: number;
  imagen: string;
  categoriaId: number; // Clave foránea
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
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'categorias', // Nombre de la tabla de categorías
      key: 'id'
    }
  }
}, {
  timestamps: false,
  tableName: 'productos'
});



// Hook para registrar la categoría cuando se establece el campo 'tipo'
Product.beforeUpdate(async (product) => {
  if (product.tipo) {
    const [category, created] = await Category.findOrCreate({
      where: { nombre: product.tipo },
      defaults: { nombre: product.tipo }
    });
    product.tipo = category.nombre;
  }
});


