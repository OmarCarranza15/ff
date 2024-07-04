import PermisoModel from "../models/PerfilModels.js";

/*cada permiso que se manipula desde la pagina web, 
la tabla se modificara de forma automatica*/

//Muestra todos los permisos que estan en la base de datos 
export const getAllPermisos = async (req, res) => {
    try{
        const permisos = await PermisoModel.findAll();
        res.json(permisos);
    } catch (error) {
        res.json({message: error.message});
    }
};


//Muestra un permiso de la base de datos
export const getPermiso = async (req, res ) => {
    try{
        const permiso = await PermisoModel.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(permiso[0]);
    } catch (error){
        res.json({message: error.message});
    }
};



//Crear un permiso en la base de datos
export const createPermiso = async (req, res) => {
    try {
        const perm = await PermisoModel.create(req.body);
        res.json({
            "message": "¡Ha sido registrado correctamente!",
            "id": perm.id
        });
    } catch (error) {
        res.json({ message: error.message});
    }
};

//Actualizar un permiso de la base de datos
export const updatePermiso = async (req, res) => {
    try{
        await PermisoModel.update(req.body, {
            where: { id: req.params.id}
        });
        res.json({
            "message": "¡Registro actualizado correctamente!"
        });
    } catch (error) {
        res.json({message: error.message});
    }
};


