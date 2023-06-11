import  express  from "express";

const router = express.Router();

import {registrar, perfil, confirmar, autenticar, olvidePassword,
comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword} from "../Controllers/veterinarioController.js"

import checkAuth from "../middleware/authMiddleware.js"

//Area pública
router.post("/", registrar) //Para registrar el usuario
router.get("/confirmar/:token", confirmar) //Para confirmar su cuenta
router.post("/login", autenticar) //Para iniciar sesion
router.post("/olvide-password", olvidePassword);

//Esta sintaxis sirve para cuando se apunta a la misma url pero con diferentes metodos
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);


//Area privada
// Cuando visitemos perfil este pasara a checkauth y ejecutara su código, luego con el next
// saltara al siguiente que es perfil
router.get("/perfil",  checkAuth,perfil) 
router.put("/perfil/:id", checkAuth, actualizarPerfil)
router.put("/actualizar-password", checkAuth, actualizarPassword);
export default router;