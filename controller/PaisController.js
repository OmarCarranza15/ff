import PaisModel from "../models/PaisModels.js";

/*cada Pais que se manipula desde la pagina web, 
la tabla se modificara de forma automatica*/

//Muestra todos los Paises que estan en la base de datos 
export const getAllPais = async (req, res) => {
    try{
        const Paises = await PaisModel.findAll();
        res.json(Paises);
    } catch (error) {
        res.json({message: error.message});
    }
};


//Muestra un Pais de la base de datos
export const getPais = async (req, res ) => {
    try{
        const Pais = await PaisModel.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(Pais[0]);
    } catch (error){
        res.json({message: error.message});
    }
};



//Crear un Pais en la base de datos
export const createPais = async (req, res) => {
    try {
        const Pai = await PaisModel.create(req.body);
        res.json({
            "message": "¡Ha sido registrado correctamente!",
            "id": Pai.id
        });
    } catch (error) {
        res.json({ message: error.message});
    }
};

//Actualizar un Pais de la base de datos
export const updatePais = async (req, res) => {
    try{
        await PaisModel.update(req.body, {
            where: { id: req.params.id}
        });
        res.json({
            "message": "¡Registro actualizado correctamente!"
        });
    } catch (error) {
        res.json({message: error.message});
    }
};