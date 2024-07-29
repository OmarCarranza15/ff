import {db} from "../database/db.js";
import DataTypes from "sequelize";

/*Traemos cada uno de los datos de la tabla Usuarios y le ponemos 
el tipo de dato que lo conforma, de igual froma si el dato es null*/

const AuditoriaModel = db.define('Auditoria', {
    Tabla: {type: DataTypes.STRING},
    Accion: {type: DataTypes.INTEGER},
    ID_Usuario: {type: DataTypes.INTEGER},
    Fecha: {type: DataTypes.DATE},

},{
    tableName: 'Auditoria',
    timestamps: false
});


export default AuditoriaModel;