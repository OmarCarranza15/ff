import {db} from "../database/db.js";
import DataTypes from "sequelize";

/*Traemos cada uno de los datos de la tabla Usuarios y le ponemos 
el tipo de dato que lo conforma, de igual froma si el dato es null*/

const PuestoInModel = db.define('PuestoIn', {
    N_PuestoIn: {type: DataTypes.STRING}

},{
    tableName: 'PuestoIn',
    timestamps: false
});


export default PuestoInModel;