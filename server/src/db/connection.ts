import { Sequelize } from "sequelize";


const sequelize = new Sequelize('sensualite','root','',{
    host:'localhost',
    port: 3306,
    dialect: 'mysql',
    //logging: false
});

sequelize.sync({ alter: true })  // Usar alter: true para ajustar la tabla según los cambios en el modelo
  .then(() => {
    console.log('Tablas sincronizadas correctamente');
  })
  .catch((error) => {
    console.error('Error al sincronizar las tablas:', error);
  });

export default sequelize;
