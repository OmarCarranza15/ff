import {db} from "../database/db.js";
import DataTypes from "sequelize";

/*Traemos cada uno de los datos de la tabla Usuarios y le ponemos 
el tipo de dato que lo conforma, de igual froma si el dato es null*/

const UsuarioModel = db.define('Usuario', {
    Usuario: {type: DataTypes.STRING},
    Nombre: {type: DataTypes.STRING},
    Contrasenia: {type: DataTypes.STRING},
    Fec_Creacion: {type: DataTypes.DATEONLY},
    Fec_Ult_Conexion: {type: DataTypes.DATEONLY},    
    Fec_Exp_Acceso: {type: DataTypes.DATEONLY},
    Estado: {type: DataTypes.INTEGER},
    ID_PuestoIn: {type: DataTypes.INTEGER},
    ID_RolUsuario: {type: DataTypes.INTEGER}

},{
    tableName: 'Usuario',
    timestamps: false
});


export default UsuarioModel;

