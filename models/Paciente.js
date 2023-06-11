import mongoose from "mongoose";

const pacientesSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
    },
    propietario:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    fecha:{
        type: Date,
        required: true,
        default: Date.now(),
    },
    sintomas:{
        type: String,
        required: true,
    },
    //Esto es como si fuera la llave foranea
    veterinario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veterinario',
    },
},{
    timestamps:true  //Para que cree las columnas de editar
});

const Paciente = mongoose.model("Paciente", pacientesSchema);

export default Paciente;
