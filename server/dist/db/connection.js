"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('sensualite', 'root', 'BMW&2502@', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    //logging: false
});
sequelize.sync({ alter: true }) // Usar alter: true para ajustar la tabla según los cambios en el modelo
    .then(() => {
    console.log('Tablas sincronizadas correctamente');
})
    .catch((error) => {
    console.error('Error al sincronizar las tablas:', error);
});
exports.default = sequelize;
