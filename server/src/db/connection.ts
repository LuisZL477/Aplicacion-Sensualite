import { Sequelize } from "sequelize";


const sequelize = new Sequelize('sensualite','root','',{
    host:'localhost',
    port: 3306,
    dialect: 'mysql',
    //logging: false
});

export default sequelize