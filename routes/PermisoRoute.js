import express from "express";
import {getAllPermisos, getPermiso, createPermiso, updatePermiso} from "../controller/PermisosController.js";

const router = express.Router();

//Rutas de Permisos//
router.get('/', getAllPermisos);
router.get('/:id', getPermiso);
router.post('/', createPermiso);
router.put('/:id', updatePermiso);

export default router;


