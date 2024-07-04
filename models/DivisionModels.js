import {db} from "../database/db.js";
import DataTypes from "sequelize";

const DivisionModel = db.define('Division', {
    N_Division: {type: DataTypes.STRING},
    ID_Pais: {type: DataTypes.INTEGER}
}, {
    tableName: 'Division',
    timestamps: false
});

export default DivisionModel;