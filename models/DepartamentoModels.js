import {db} from "../database/db.js";
import DataTypes from "sequelize";

const DepartamentoModel = db.define('Departamento', {
    N_Departamento: {type: DataTypes.STRING},
    ID_Pais: {type: DataTypes.INTEGER}
}, {
    tableName: 'Departamento',
    timestamps: false
});

export default DepartamentoModel;