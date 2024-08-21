import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export const User = sequelize.define('user',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
        
    }, 
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    edad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING,
        
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
        
    },
    domicilio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
   
    },{
        timestamps:false,
        tableName:'Usuario'
    })

      export default User;