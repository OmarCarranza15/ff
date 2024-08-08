import express from "express";
import {getAllDepartamentos, getDepartamento, createDepartamento, updateDepartamento} from "../controller/DepartamentoController.js";

const router = express.Router();

//Rutas del Departamento//
router.get('/', getAllDepartamentos);
router.get('/:id', getDepartamento);
router.post('/', createDepartamento);
router.put('/:id', updateDepartamento);

export default router;