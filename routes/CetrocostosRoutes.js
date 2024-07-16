import express from "express";
import {getAllCetrocostos, getCetrocosto, createCetrocosto, updateCetrocosto} from "../controller/CentrocostosController.js";

const router = express.Router();

//Rutas del Usuario//
router.get('/', getAllCetrocostos);
router.get('/:id', getCetrocosto);
router.post('/', createCetrocosto);
router.put('/:id', updateCetrocosto);

export default router;