import express from "express";
import {getAllRSocial, getRSocial, createRSocial, updateRSocial} from "../controller/RSocialController.js";

const router = express.Router();

//Rutas de Razon Social//
router.get('/', getAllRSocial);
router.get('/:id', getRSocial);
router.post('/', createRSocial);
router.put('/:id', updateRSocial);

export default router;