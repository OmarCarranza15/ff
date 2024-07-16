import {db} from "../database/db.js";
import DataTypes from "sequelize";

const AmbienteModel = db.define('Ambientes', {
    N_Ambiente: {type: DataTypes.STRING}
}, {
    tableName: 'Ambientes',
    timestamps: false
});

export default AmbienteModel;


