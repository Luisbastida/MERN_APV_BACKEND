import  express  from "express";

const router = express.Router();

import { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente } from "../Controllers/pacienteController.js";
import checkAuth from "../middleware/authMiddleware.js"

router.route("/").post(checkAuth, agregarPaciente).get(checkAuth ,obtenerPacientes)

// Para generar el crud compelto
router.route('/:id')
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente)

export default router;