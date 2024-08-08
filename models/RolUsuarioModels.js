import {db} from "../database/db.js";
import DataTypes from "sequelize";

/*Traemos cada uno de los datos de la tabla Usuarios y le ponemos 
el tipo de dato que lo conforma, de igual froma si el dato es null*/

const RolUsuarioModel = db.define('RolUsuario', {
    N_Rol: {type: DataTypes.STRING},
    Des_Rol: {type: DataTypes.STRING},
    Fec_Creacion: {type: DataTypes.DATE},
    Fec_Modificacion: {type: DataTypes.DATE},
    createdAt: {type: DataTypes.DATE},
    ID_Permisos: {type: DataTypes.INTEGER},
    Paises: {type: DataTypes.STRING},
    Insertar: {type: DataTypes.INTEGER},
    Editar: {type: DataTypes.INTEGER}
},{
    tableName: 'RolUsuario',
    timestamps: false
});


export default RolUsuarioModel;