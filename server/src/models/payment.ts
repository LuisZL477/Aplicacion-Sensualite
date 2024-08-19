import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../db/connection'; // Asegúrate de ajustar la ruta a tu configuración de Sequelize

class Pago extends Model {
  public idpago!: number;
  public tipopago!: string;
  public compras_id_compra!: number;
  public compras_usuarios_idusuario!: number;
}

Pago.init({
  idpago: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  tipopago: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  compras_id_compra: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'compras', // Nombre de la tabla 'compras'
      key: 'id_compra',
    },
  },
  compras_usuarios_idusuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios', // Nombre de la tabla 'usuarios'
      key: 'idusuario',
    },
  },
}, {
  sequelize,
  tableName: 'pagos',
  timestamps: false,
});

export default Pago; // Exporta el modelo
