import express from "express";
import {getAllDivisiones, getDivision, createDivision, updateDivision} from "../controller/DivisionController.js";

const router = express.Router();

//Rutas de la Division//
router.get('/', getAllDivisiones);
router.get('/:id', getDivision);
router.post('/', createDivision);
router.put('/:id', updateDivision);

export default router;