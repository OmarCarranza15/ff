import DivisionModel from "../models/DivisionModels.js";

/*cada Division que se manipula desde la pagina web, 
la tabla se modificara de forma automatica*/

//Muestra todos las Divisiones que estan en la base de datos 
export const getAllDivisiones = async (req, res) => {
    try{
        const Divisiones = await DivisionModel.findAll();
        res.json(Divisiones);
    } catch (error) {
        res.json({message: error.message});
    }
};


//Muestra una division de la base de datos
export const getDivision = async (req, res ) => {
    try{
        const Division = await DivisionModel.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(Division[0]);
    } catch (error){
        res.json({message: error.message});
    }
};



//Crear una division en la base de datos
export const createDivision = async (req, res) => {
    try {
        const divi = await DivisionModel.create(req.body);
        res.json({
            "message": "¡Ha sido registrado correctamente!",
            "id": divi.id
        });
    } catch (error) {
        res.json({ message: error.message});
    }
};

//Actualizar una division de la base de datos
export const updateDivision = async (req, res) => {
    try{
        await DivisionModel.update(req.body, {
            where: { id: req.params.id}
        });
        res.json({
            "message": "¡Registro actualizado correctamente!"
        });
    } catch (error) {
        res.json({message: error.message});
    }
};


