import RSocialModel from "../models/RSocialModels.js";

/*cada Razon Social que se manipula desde la pagina web, 
la tabla se modificara de forma automatica*/

//Muestra todos las Razones Sociales que estan en la base de datos 
export const getAllRSocial = async (req, res) => {
    try{
        const RSociales = await RSocialModel.findAll();
        res.json(RSociales);
    } catch (error) {
        res.json({message: error.message});
    }
};


//Muestra una Razon Social de la base de datos
export const getRSocial = async (req, res ) => {
    try{
        const RSocial = await RSocialModel.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(RSocial[0]);
    } catch (error){
        res.json({message: error.message});
    }
};



//Crear una Razon Social en la base de datos
export const createRSocial = async (req, res) => {
    try {
        const rs = await RSocialModel.create(req.body);
        res.json({
            "message": "¡Ha sido registrado correctamente!",
            "id": rs.id
        });
    } catch (error) {
        res.json({ message: error.message});
    }
};

//Actualizar una Razon Social de la base de datos
export const updateRSocial = async (req, res) => {
    try{
        await RSocialModel.update(req.body, {
            where: { id: req.params.id}
        });
        res.json({
            "message": "¡Registro actualizado correctamente!"
        });
    } catch (error) {
        res.json({message: error.message});
    }
};


