//Importacion de modulos
import {Sequelize} from 'sequelize';

                             //Base de datos   //Usuario      //Contraseña
const db = new Sequelize('DB_Ficohsa', 'ficohsa2024', 'ficohsa,24', {
    dialect: 'mssql', //Nombre del gestor de base de datos que utilizamos
    host: 'localhost', //Nombre del servidor, por defecto usamos localhost
    port: 1433, //El puerto por defecto
    dialectOptions:{
        options: {
            trustedConnection: true //habilitamos autorizacion de windows
        }
    }
});

export {db};
//export {sequelize}; // Exportamos sequelize como un objeto nombrado 


