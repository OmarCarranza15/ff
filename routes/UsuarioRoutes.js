import express from "express";
import {getAllUsuarios, getUsuario, createUsuario, updateUsuario} from "../controller/UsuarioController.js";

const router = express.Router();

//Rutas del Usuario//
router.get('/', getAllUsuarios);
router.get('/:id', getUsuario);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);

export default router;


