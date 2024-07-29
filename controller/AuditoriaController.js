import AuditoriaModel from "../models/AuditoriaModels.js";

/*cada usuario que se manipula desde la pagina web, 
la tabla se modificara de forma automatica*/

//Muestra todos los usuarios que estan en la base de datos 
export const getAllAuditoria = async (req, res) => {
    try{
        const Auditorias = await AuditoriaModel.findAll();
        res.json(Auditorias);
    } catch (error) {
        res.json({message: error.message});
    }
};


//Muestra un Usuario de la base de datos
export const getAuditoria = async (req, res ) => {
    try{
        const Auditoria = await AuditoriaModel.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(Auditoria[0]);
    } catch (error){
        res.json({message: error.message});
    }
};



//Crear un Usuario en la base de datos
export const createAuditoria = async (req, res) => {
    try {
        const audi = await AuditoriaModel.create(req.body);
        res.json({
            "message": "¡Ha sido registrado correctamente!",
            "id": audi.id
        });
    } catch (error) {
        res.json({ message: error.message});
    }
};

//Actualizar un Usuario de la base de datos
export const updateAuditoria = async (req, res) => {
    try{
        await AuditoriaModel.update(req.body, {
            where: { id: req.params.id}
        });
        res.json({
            "message": "¡Registro actualizado correctamente!"
        });
    } catch (error) {
        res.json({message: error.message});
    }
};


