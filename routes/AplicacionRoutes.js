import express from "express";
import {getAllAplicaciones, getAplicacion, createAplicacion, updateAplicacion} from "../controller/AplicacionController.js";

const router = express.Router();

//Rutas del Usuario//
router.get('/', getAllAplicaciones);
router.get('/:id', getAplicacion);
router.post('/', createAplicacion);
router.put('/:id', updateAplicacion);

export default router;


