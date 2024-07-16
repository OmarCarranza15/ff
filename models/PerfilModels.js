import {db} from "../database/db.js";
import DataTypes from "sequelize";

const PerfilModel = db.define('Perfil', {
    Rol: {type: DataTypes.STRING},
    Ticket: { type: DataTypes.INTEGER},
    Observaciones: {type: DataTypes.STRING},
    Puesto_Jefe: {type: DataTypes.STRING},
    Estado_Perfil: {type: DataTypes.INTEGER},
    ID_Pais: {type: DataTypes.INTEGER},
    ID_Puesto: {type: DataTypes.INTEGER},
    ID_Aplicaciones: {type: DataTypes.INTEGER},
    Cod_Menu: {type: DataTypes.INTEGER}
}, {
    tableName: 'Perfiles',
    timestamps: false
})

export default PerfilModel;