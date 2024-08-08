import AplicacionModel from "../models/AplicacionModels.js";

/*cada Aplicacion que se manipula desde la pagina web, 
la tabla se modificara de forma automatica*/

//Muestra todos las Aplicaciones que estan en la base de datos 
export const getAllAplicaciones = async (req, res) => {
    try{
        const Aplicaciones = await AplicacionModel.findAll();
        res.json(Aplicaciones);
    } catch (error) {
        res.json({message: error.message});
    }
};


//Muestra una Aplicacion de la base de datos
export const getAplicacion = async (req, res ) => {
    try{
        const Aplicacion = await AplicacionModel.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(Aplicacion[0]);
    } catch (error){
        res.json({message: error.message});
    }
};



//Crear una Aplicacion en la base de datos
export const createAplicacion = async (req, res) => {
    try {
        const apli = await AplicacionModel.create(req.body);
        res.json({
            "message": "¡Ha sido registrado correctamente!",
            "id": apli.id
        });
    } catch (error) {
        res.json({ message: error.message});
    }
};

//Actualizar uns Aplicacion de la base de datos
export const updateAplicacion = async (req, res) => {
    try{
        await AplicacionModel.update(req.body, {
            where: { id: req.params.id}
        });
        res.json({
            "message": "¡Registro actualizado correctamente!"
        });
    } catch (error) {
        res.json({message: error.message});
    }
};


