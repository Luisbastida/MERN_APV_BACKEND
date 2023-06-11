import Veterinario from "../models/Veterianario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js"

//Estas son las rutas que se importan en veterinario routers
const registrar = async (req, res)=>{ 


    const { email, nombre} = req.body;
    //Prevenir que un usuario ya exista y mandar un mensaje 
    //El await por si es que toma mucho tiempo a la hora de buscarlo
    const existeUsuario = await Veterinario.findOne({ email });

    if(existeUsuario){
       const error = new Error("Usuario ya registrado");
       return res.status(400).json({msg: error.message}); //Para mandar mensaje en postman
    }

    try {
        //Guardar nuevo Veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //EnVIAR EMAIL
        emailRegistro({
            email, 
            nombre, 
            token: veterinarioGuardado.token,
        });
        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error)
    }
   
}

const perfil = (req, res)=>{

    const {veterinario } = req;
    res.json(veterinario)
}

const confirmar = async (req, res) =>{

    //Consultamos la BD buscando el token
    const {token} = req.params;
    const usuarioConfirmar = await Veterinario.findOne({token});

    //Se revisa si el token es real
    if(!usuarioConfirmar){
        const error = new Error("Token no valido");
        return res.status(404).json({msg: error.message})
    }

    //Cuando el usuario sea confirmado se elimina el oken y confirmado pasa a ser trye
    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({msg: "Usuario confirmado correctamente"})
    } catch (error) {
        console.log(error);
    }
    console.log(usuarioConfirmar)

}


const autenticar = async (req, res)=>{
  

    const {email, password} = req.body;

    // Comprobar si el usuario ya existe
    const usuario = await Veterinario.findOne({email})

    //Comprobar si el usuario no existe
    if(!usuario){
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg: error.message})
    }


    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(404).json({msg: error.message});
    }

    //Revisar el password
    if(await usuario.comprobarPassword(password)){
        //Autenticar 
        //Esta linea sirve con la funcion de generarJWt para darnos un token 
//a la hora de autenticar el usuario para asi solamete poder buscarlo mediante el id
        res.json({
            _id : usuario._id,
            nombre : usuario.nombre,
            email : usuario.email,
            token: generarJWT(usuario.id)},
        )
    }else{
        const error = new Error("El password es incorrecto");
        return res.status(404).json({msg: error.message});
    }
};

const olvidePassword = async (req, res)=>{
    const {email} = req.body
   
    const existeVeterinario = await Veterinario.findOne({email});
    if(!existeVeterinario){
        const error = new Error('El usuario no existe');
        return res.status(403).json({msg: error.message})
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        //Enviar Email
        emailOlvidePassword({
            email, 
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token,
        })
        res.json({msg: "Hemos enviado un email con las instrucciones"})
    } catch (error) {
        
    }
}
const comprobarToken = async (req, res)=>{
    const {token} = req.params;
    

    const tokenValido = await Veterinario.findOne({token});
    if(tokenValido){
        res.json({msg: "El token es valido y el usuario existe"})
    }else{
        const error = new Error("Token no valido");
        return res.status(400).json({msg: error.message});
    }
}
const nuevoPassword = async (req, res)=>{
    const {token} =  req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});
    if(!veterinario){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: "Password modificado correctamente"})
    } catch (error) {
        console.log(error)
    }
}

const actualizarPerfil =  async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message})
    }

    const {email} = req.body
    if(veterinario.email !==  req.body.email){
    const existeEmail = await Veterinario.findOne({email})
        if(existeEmail){
            const error = new Error('Ese email ya esta en uso');
            return res.status(400).json({msg: error.message})
        }
    }
    try {
        veterinario.nombre = req.body.nombre
        veterinario.email = req.body.email
        veterinario.web = req.body.web
        veterinario.telefono = req.body.telefono

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado)
        veterinario.nombre = req.body.nombre
    } catch (error) {
        console.log(error)
    }
   
}

const actualizarPassword = async (req,res) =>{
      //Leer los datos
      const {id} = req.veterinario;
      const {pwd_actual, pwd_nuevo} = req.body;
  
      //Comprobar si el veterinario existe
      const veterinario = await Veterinario.findById(id);
      if(!veterinario){
          const error = new Error('Hubo un error');
          return res.status(400).json({msg: error.message})
      }
  
  
      //Comprobar su password
      if(await veterinario.comprobarPassword(pwd_actual)){
          //Almacenar el nuevo password
          veterinario.password = pwd_nuevo;
          await veterinario.save();
          res.json({msg: 'Password Almacenado Correctamente'})
      }else{
          const error = new Error('El password Actual es Incorrecto');
          return res.status(400).json({msg: error.message});
      }
  
}
export {registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword}