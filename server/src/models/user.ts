import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export const User = sequelize.define('user',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false
        
    }, 
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
      
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
        
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tel: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
   
    },{
        createdAt:false,
        updatedAt:false
      } )

      export default User;