import PuestoModel from "../models/PuestoModels.js";

/*cada Puesto que se manipula desde la pagina web, 
la tabla se modificara de forma automatica*/

//Muestra todos los Puestos que estan en la base de datos 
export const getAllPuestos = async (req, res) => {
    try{
        const Puestos = await PuestoModel.findAll();
        res.json(Puestos);
    } catch (error) {
        res.json({message: error.message});
    }
};


//Muestra un Puesto de la base de datos
export const getPuesto = async (req, res ) => {
    try{
        const Puesto = await PuestoModel.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(Puesto[0]);
    } catch (error){
        res.json({message: error.message});
    }
};



//Crear un Puesto en la base de datos
export const createPuesto = async (req, res) => {
    try {
        const pue = await PuestoModel.create(req.body);
        res.json({
            "message": "¡Ha sido registrado correctamente!",
            "id": pue.id
        });
    } catch (error) {
        res.json({ message: error.message});
    }
};

//Actualizar un Puesto de la base de datos
export const updatePuesto = async (req, res) => {
    try{
        await PuestoModel.update(req.body, {
            where: { id: req.params.id}
        });
        res.json({
            "message": "¡Registro actualizado correctamente!"
        });
    } catch (error) {
        res.json({message: error.message});
    }
};