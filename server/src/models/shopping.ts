import { DataTypes } from "sequelize";
import sequelize from "../db/connection";

export const Shop = sequelize.define('shopping',{
    id:{
       type: DataTypes.INTEGER,
       primaryKey: true,
       autoIncrement: true 
    },
    tipo:{
        type: DataTypes.STRING
    },
    fecha:{
        type: DataTypes.DATE,
    }
},{
    timestamps:false,
    tableName:'Compras'
});