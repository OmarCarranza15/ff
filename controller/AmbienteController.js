import AmbienteModel from "../models/AmbienteModels.js";

/*cada Ambiente que se manipula desde la pagina web, 
la tabla se modificara de forma automatica*/

//Muestra todos los Ambientes que estan en la base de datos 
export const getAllAmbientes = async (req, res) => {
    try{
        const Ambientes = await AmbienteModel.findAll();
        res.json(Ambientes);
    } catch (error) {
        res.json({message: error.message});
    }
};


//Muestra un Ambiente de la base de datos
export const getAmbiente = async (req, res ) => {
    try{
        const Ambiente = await AmbienteModel.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(Ambiente[0]);
    } catch (error){
        res.json({message: error.message});
    }
};



//Crear un Ambiente en la base de datos
export const createAmbiente = async (req, res) => {
    try {
        const ambi = await AmbienteModel.create(req.body);
        res.json({
            "message": "¡Ha sido registrado correctamente!",
            "id": ambi.id
        });
    } catch (error) {
        res.json({ message: error.message});
    }
};

//Actualizar un Ambiente de la base de datos
export const updateAmbiente = async (req, res) => {
    try{
        await AmbienteModel.update(req.body, {
            where: { id: req.params.id}
        });
        res.json({
            "message": "¡Registro actualizado correctamente!"
        });
    } catch (error) {
        res.json({message: error.message});
    }
};


