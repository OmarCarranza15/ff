import express from "express";
import {getAllAmbientes, getAmbiente, createAmbiente, updateAmbiente} from "../controller/AmbienteController.js";

const router = express.Router();

//Rutas del Usuario//
router.get('/', getAllAmbientes);
router.get('/:id', getAmbiente);
router.post('/', createAmbiente);
router.put('/:id', updateAmbiente);

export default router;
