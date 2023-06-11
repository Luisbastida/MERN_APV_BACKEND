import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterianario.js"
const checkAuth = async (req, res, next)=>{
    let token;
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")){
    }
    
    try {
        //Para que solo muestre el token y no Bearer al tomar la posicion uno dle arreglo que es le token
        token = req.headers.authorization.split(' ')[1];
        //Verifica el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //Sirve el select para indicar que no muestre ni el password, ni confirmado ni el token
        req.veterinario =  await Veterinario.findById(decoded.id).select("-password -token -confirmado")
        return next();
    } catch (error) {
        const e = new Error('Token no valido');
        res.status(403).json({msg: e.message});
    }

    //Si no existe un token
    if(!token){
        const error = new Error('Token no valido o inexistente');
        res.status(403).json({msg: error.message});
    }
    


    next();
}

export default checkAuth;