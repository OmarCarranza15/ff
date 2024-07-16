import CetrocostosModel from "../models/CentrocostosModels.js";

/*cada Centro de Costos que se manipula desde la pagina web, 
la tabla se modificara de forma automatica*/

//Muestra todos los Centro de costos que estan en la base de datos 
export const getAllCetrocostos = async (req, res) => {
    try{
        const Cetrocostos = await CetrocostosModel.findAll();
        res.json(Cetrocostos);
    } catch (error) {
        res.json({message: error.message});
    }
};


//Muestra un Centro de Costos de la base de datos
export const getCetrocosto = async (req, res ) => {
    try{
        const Cetrocosto = await CetrocostosModel.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(Cetrocosto[0]);
    } catch (error){
        res.json({message: error.message});
    }
};



//Crear un Centro de Costos en la base de datos
export const createCetrocosto = async (req, res) => {
    try {
        const costos = await CetrocostosModel.create(req.body);
        res.json({
            "message": "¡Ha sido registrado correctamente!",
            "id": costos.id
        });
    } catch (error) {
        res.json({ message: error.message});
    }
};

//Actualizar un Usuario de la base de datos
export const updateCetrocosto = async (req, res) => {
    try{
        await CetrocostosModel.update(req.body, {
            where: { id: req.params.id}
        });
        res.json({
            "message": "¡Registro actualizado correctamente!"
        });
    } catch (error) {
        res.json({message: error.message});
    }
};


