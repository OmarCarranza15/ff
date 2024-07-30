import {db} from "../database/db.js";
import DataTypes from "sequelize";

const PaisModel = db.define('Pais', {
    N_Pais: {type: DataTypes.STRING}
}, {
    tableName: 'Pais',
    timestamps: false
});

export default PaisModel;


