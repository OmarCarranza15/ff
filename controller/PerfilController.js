import PerfilModel from "../models/PerfilModels.js";

/*cada perfil que se manipula desde la pagina web, 
la tabla se modificara de forma automatica*/

//Muestra todos los Perfil que estan en la base de datos 
export const getAllPerfiles = async (req, res) => {
    try{
        const Perfiles = await PerfilModel.findAll();
        res.json(Perfiles);
    } catch (error) {
        res.json({message: error.message});
    }
};


//Muestra un Perfil de la base de datos
export const getPerfil = async (req, res ) => {
    try{
        const Perfil = await PerfilModel.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(Perfil[0]);
    } catch (error){
        res.json({message: error.message});
    }
};



//Crear un Perfil en la base de datos
export const createPerfil = async (req, res) => {
    try {
        const per = await PerfilModel.create(req.body);
        res.json({
            "message": "¡Ha sido registrado correctamente!",
            "id": per.id
        });
    } catch (error) {
        res.json({ message: error.message});
    }
};

//Actualizar un Perfil de la base de datos
export const updatePerfil = async (req, res) => {
    try{
        await PerfilModel.update(req.body, {
            where: { id: req.params.id}
        });
        res.json({
            "message": "¡Registro actualizado correctamente!"
        });
    } catch (error) {
        res.json({message: error.message});
    }
};