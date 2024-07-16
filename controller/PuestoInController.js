import PuestoInModel from "../models/PuestoInModels.js"

/*cada PuestoIn que se manipula desde la pagina web, 
la tabla se modificara de forma automatica*/

//Muestra todos los PuestoIn que estan en la base de datos 
export const getAllPuestoIn = async (req, res) => {
    try{
        const PuestoIns = await PuestoInModel.findAll();
        res.json(PuestoIns);
    } catch (error) {
        res.json({message: error.message});
    }
};


//Muestra un PuestoIn de la base de datos
export const getPuestoIn = async (req, res ) => {
    try{
        const PuestoIn = await PuestoInModel.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(PuestoIn[0]);
    } catch (error){
        res.json({message: error.message});
    }
};



//Crear un PuestoIn en la base de datos
export const createPuestoIn = async (req, res) => {
    try {
        const pin = await PuestoInModel.create(req.body);
        res.json({
            "message": "¡Ha sido registrado correctamente!",
            "id": pin.id
        });
    } catch (error) {
        res.json({ message: error.message});
    }
};

//Actualizar un PuestoIn de la base de datos
export const updatePuestoIn = async (req, res) => {
    try{
        await PuestoInModel.update(req.body, {
            where: { id: req.params.id}
        });
        res.json({
            "message": "¡Registro actualizado correctamente!"
        });
    } catch (error) {
        res.json({message: error.message});
    }
};


