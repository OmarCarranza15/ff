import {db} from "../database/db.js";
import DataTypes from "sequelize";

const CetrocostosModel = db.define('CentroCostos', {
    Codigo: {type: DataTypes.STRING},
    Nombre: {type: DataTypes.STRING},
    ID_Pais: {type: DataTypes.INTEGER}
}, {
    tableName: 'CentroCostos',
    timestamps: false
});

export default CetrocostosModel;

