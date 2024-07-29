import express from "express";
import {getAllPais, getPais, createPais, updatePais} from "../controller/PaisController.js";

const router = express.Router();

//Rutas del Pais//
router.get('/', getAllPais);
router.get('/:id', getPais);
router.post('/', createPais);
router.put('/:id', updatePais);

export default router;

