import express from "express";
import {getAllPuestoIn, getPuestoIn, createPuestoIn, updatePuestoIn} from "../controller/PuestoInController.js";

const router = express.Router();

//Rutas del Puesto Interno//
router.get('/', getAllPuestoIn);
router.get('/:id', getPuestoIn);
router.post('/', createPuestoIn);
router.put('/:id', updatePuestoIn);

export default router;


