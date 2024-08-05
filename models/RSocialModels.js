import {db} from "../database/db.js";
import DataTypes from "sequelize";

const RSocialModel = db.define('RSocial', {
    N_RSocial: {type: DataTypes.STRING},
    ID_Pais: {type: DataTypes.INTEGER}
}, {
    tableName: 'RSocial',
    timestamps: false
});

export default RSocialModel;