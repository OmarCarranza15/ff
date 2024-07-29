import DepartamentoModel from "../models/DepartamentoModels.js";

/*cada Departamento que se manipula desde la pagina web, 
la tabla se modificara de forma automatica*/

//Muestra todos los Departamentos que estan en la base de datos 
export const getAllDepartamentos = async (req, res) => {
    try{
        const Departamentos = await DepartamentoModel.findAll();
        res.json(Departamentos);
    } catch (error) {
        res.json({message: error.message});
    }
};


//Muestra un Departamento de la base de datos
export const getDepartamento = async (req, res ) => {
    try{
        const Departamento = await DepartamentoModel.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(Departamento[0]);
    } catch (error){
        res.json({message: error.message});
    }
};



//Crear un Departamento en la base de datos
export const createDepartamento = async (req, res) => {
    try {
        const depa = await DepartamentoModel.create(req.body);
        res.json({
            "message": "¡Ha sido registrado correctamente!",
            "id": depa.id
        });
    } catch (error) {
        res.json({ message: error.message});
    }
};

//Actualizar un Departamento de la base de datos
export const updateDepartamento = async (req, res) => {
    try{
        await DepartamentoModel.update(req.body, {
            where: { id: req.params.id}
        });
        res.json({
            "message": "¡Registro actualizado correctamente!"
        });
    } catch (error) {
        res.json({message: error.message});
    }
};


