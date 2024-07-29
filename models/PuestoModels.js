import {db} from "../database/db.js";
import DataTypes from "sequelize";

const PuestoModel = db.define('Puesto', {
    Codigo: {type: DataTypes.INTEGER},
    N_Puesto: {type: DataTypes.STRING},
    ID_Pais: {type: DataTypes.INTEGER},
    ID_RSocial: {type: DataTypes.INTEGER},
    ID_Division: {type: DataTypes.INTEGER},
    ID_Departamento: {type: DataTypes.INTEGER},
    ID_CentroCostos: {type: DataTypes.INTEGER} 
}, {
    tableName: 'Puestos',
    timestamps: false
});

export default PuestoModel;