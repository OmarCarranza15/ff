import RolUsuarioModel from "../models/RolUsuarioModels.js";

/*cada Rol del usuario que se manipula desde la pagina web, 
la tabla se modificara de forma automatica*/

//Muestra todos los Roles del usuario que estan en la base de datos 
export const getAllRolUsuario = async (req, res) => {
    try{
        const rolusuarios = await RolUsuarioModel.findAll();
        res.json(rolusuarios );
    } catch (error) {
        res.json({message: error.message});
    }
};


//Muestra un Rol del usuario de la base de datos
export const getRolUsuario = async (req, res ) => {
    try{
        const rolusuario = await RolUsuarioModel.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(rolusuario[0]);
    } catch (error){
        res.json({message: error.message});
    }
};



//Crear un Rol del usuario en la base de datos
export const createRolUsuario = async (req, res) => {
    try {
        const rol = await RolUsuarioModel.create(req.body);
        res.json({
            "message": "¡Ha sido registrado correctamente!",
            "id": rol.id
        });
    } catch (error) {
        res.json({ message: error.message});
    }
};

//Actualizar un Rol del usuario de la base de datos
export const updateRolUsuario= async (req, res) => {
    try{
        await RolUsuarioModel.update(req.body, {
            where: { id: req.params.id}
        });
        res.json({
            "message": "¡Registro actualizado correctamente!"
        });
    } catch (error) {
        res.json({message: error.message});
    }
};
