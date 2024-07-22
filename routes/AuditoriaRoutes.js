import express from "express";
import {getAllAuditoria, getAuditoria, createAuditoria, updateAuditoria} from "../controller/AuditoriaController.js";

const router = express.Router();

//Rutas del Usuario//
router.get('/', getAllAuditoria);
router.get('/:id', getAuditoria);
router.post('/', createAuditoria);
router.put('/:id', updateAuditoria);

export default router;


