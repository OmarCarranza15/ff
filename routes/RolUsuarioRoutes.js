import express from "express";
import {getAllRolUsuario, getRolUsuario, createRolUsuario, updateRolUsuario} from "../controller/RolUsuarioController.js";

const router = express.Router();

//Rutas del Usuario//
router.get('/', getAllRolUsuario);
router.get('/:id', getRolUsuario);
router.post('/', createRolUsuario);
router.put('/:id', updateRolUsuario);

export default router;