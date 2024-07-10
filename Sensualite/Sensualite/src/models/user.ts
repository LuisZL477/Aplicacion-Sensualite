import { DataTypes } from "sequelize";
import sequelize from "../db/connection";

export const User = sequelize.define('admin',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    },{
        createdAt:false,
        updatedAt:false
      } )

      export default User;