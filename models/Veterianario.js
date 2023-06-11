import mongoose from "mongoose";
import generarId from "../helpers/generarId.js";
import bcrypt from "bcrypt"; //Sirve para hashear las contraseñas

const veterinarioSchema = mongoose.Schema({
    nombre:{
        type:String,
        require:true,
        trim:true,
    },
    password:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique: true,
        trim:true,
    },
    telefono:{
        type:String,
        default:null
    },
    web:{
        type:String,
        default:null,
    },
    token:{
        type:String,
        default: generarId(),
    },
    confirmado:{
        type:Boolean,
        default: false,
    }
});


//Esta parte del codigo sirve para hashear el password
veterinarioSchema.pre("save", async function(next){
    //Para que no hashe de nuevo una contraseña que ya esta hasheada
    if(!this.isModified("password")){
        next(); //Este password ya esta hasheado entonces vete al siguiente
    }//Aquí termina lo de ya no hashear uan contraseña ya hasheada
    const salt = await bcrypt.genSalt(10); //10 es el rango por default de roundas para hashear
    this.password = await bcrypt.hash(this.password, salt);
})



veterinarioSchema.methods.comprobarPassword = async function (
    passwordFormulario
){
    return await bcrypt.compare(passwordFormulario, this.password);
}
const Veterinario = mongoose.model("Veterinario", veterinarioSchema);

export default Veterinario;