import UsuarioModel from "../models/UsuarioModels.js";

/*cada usuario que se manipula desde la pagina web, 
la tabla se modificara de forma automatica*/

//Muestra todos los usuarios que estan en la base de datos 
export const getAllUsuarios = async (req, res) => {
    try{
        const Usuarios = await UsuarioModel.findAll();
        res.json(Usuarios);
    } catch (error) {
        res.json({message: error.message});
    }
};


//Muestra un Usuario de la base de datos
export const getUsuario = async (req, res ) => {
    try{
        const Usuario = await UsuarioModel.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(Usuario[0]);
    } catch (error){
        res.json({message: error.message});
    }
};



//Crear un Usuario en la base de datos
export const createUsuario = async (req, res) => {
    try {
        const user = await UsuarioModel.create(req.body);
        res.json({
            "message": "¡Ha sido registrado correctamente!",
            "id": user.id
        });
    } catch (error) {
        res.json({ message: error.message});
    }
};

//Actualizar un Usuario de la base de datos
export const updateUsuario = async (req, res) => {
    try{
        await UsuarioModel.update(req.body, {
            where: { id: req.params.id}
        });
        res.json({
            "message": "¡Registro actualizado correctamente!"
        });
    } catch (error) {
        res.json({message: error.message});
    }
};


