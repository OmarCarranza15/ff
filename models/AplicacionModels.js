import {db} from "../database/db.js";
import DataTypes from "sequelize";

const AplicacionModel = db.define('Aplicaciones', {
    N_Aplicaciones: {type: DataTypes.STRING},
    ID_Pais: {type: DataTypes.INTEGER},
    Ambientes: {type: DataTypes.STRING},
}, {
    tableName: 'Aplicaciones',
    timestamps: false
});

export default AplicacionModel;