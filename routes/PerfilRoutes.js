import express from "express";
import {getAllPerfiles, getPerfil, createPerfil, updatePerfil} from "../controller/PerfilController.js";

const router = express.Router();

//Rutas del Perfil//
router.get('/', getAllPerfiles);
router.get('/:id', getPerfil);
router.post('/', createPerfil);
router.put('/:id', updatePerfil);

export default router;
