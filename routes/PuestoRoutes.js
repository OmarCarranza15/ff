import express from "express";
import {getAllPuestos, getPuesto, createPuesto, updatePuesto} from "../controller/PuestoController.js";

const router = express.Router();

//Rutas del Puesto//
router.get('/', getAllPuestos);
router.get('/:id', getPuesto);
router.post('/', createPuesto);
router.put('/:id', updatePuesto);

export default router;
