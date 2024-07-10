import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export const Product = sequelize.define('product',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING
    },
    type_product:{
        type: DataTypes.STRING
    },
    price:{
        type: DataTypes.DOUBLE
    },
    description:{
        type: DataTypes.STRING
    },
    stock:{
        type: DataTypes.INTEGER
    },
    imagen:{
        type: DataTypes.BLOB
    },
    },{
        createdAt:false,
        updatedAt:false
      } )

      export default Product;