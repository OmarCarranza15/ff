import {db} from "../database/db.js";
import DataTypes from "sequelize";

/*Traemos cada uno de los datos de la tabla Usuarios y le ponemos 
el tipo de dato que lo conforma, de igual froma si el dato es null*/

const PermisoModel = db.define('Permisos', {
    P_Consulta: {type: DataTypes.INTEGER},
    P_Insertar: {type: DataTypes.INTEGER},
    P_Editar: {type: DataTypes.INTEGER},
    P_Desactivar: {type: DataTypes.INTEGER},
    P_Administrador: {type: DataTypes.INTEGER},
    P_Paises: {type: DataTypes.INTEGER}

},{
    tableName: 'Permisos',
    timestamps: false
});


export default PermisoModel;