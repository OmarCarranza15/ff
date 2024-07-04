//Importaciones de modulos
import express from "express";
import cors from "cors";
import {db} from "./database/db.js";
import usuarioRoutes from "./routes/UsuarioRoutes.js";
import paisRoutes from "./routes/PaisRoutes.js";
import perfilRoutes from "./routes/PerfilRotes.js";
import rsocialRoutes from "./routes/RSocialRoutes.js";
import puestoRoutes from "./routes/PuestoRoutes.js";
import divisionRoutes from "./routes/DivisionRoutes.js";
import departamentoRotes from "./routes/DepartamentoRoutes.js";
import aplicacionRoutes from "./routes/AplicacionRoutes.js";
import ambienteRoutes from "./routes/AmbienteRoutes.js";
import centrocostosRoutes from "./routes/CetrocostosRoutes.js"
import permisoRoutes from "./routes/PermisoRoute.js";
import rolusuarioRoutes from "./routes/RolUsuarioRoutes.js";
import PuestoIn from "./routes/PuestoInRoutes.js";


//Inicializacion de la aplicacion Espress
const app = express();

//Configuracion del CORS
app.use(cors());

//Procesa los JSON en la solicitud
app.use(express.json());

//Rutas
app.use('/usuarios', usuarioRoutes);
app.use('/pais', paisRoutes);
app.use('/perfil', perfilRoutes); 
app.use('/rsocial', rsocialRoutes);
app.use('/puesto', puestoRoutes);
app.use('/division', divisionRoutes);
app.use('/departamento', departamentoRotes);
app.use('/aplicacion', aplicacionRoutes);
app.use('/ambiente', ambienteRoutes);
app.use('/centrocosto', centrocostosRoutes);
app.use('/permiso', permisoRoutes);
app.use('/rolusuario', rolusuarioRoutes);
app.use('/puestoin', PuestoIn)


//Verifica la conexion de la base de datos
db.authenticate()
    .then(() => {
        console.log('Conexion Exitosa a la DB');
        //Iniciar el servidor despues de que se establezca la conexion a la base de datos 
        const PORT = process.env.PORT || 3000; /*Puerto 1433 por defecto, ya que ese puerto 
                                               lo utiliza SQL Server predeterminadamente*/
        app.listen(PORT, () => {
            console.log(`Server UP running in http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error(`Error de conexion a la DB: ${error}`);
    });


