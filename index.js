import  express  from "express";
import dotenv from "dotenv";
// Cors sirve para proteger los datos de la api
import cors from "cors";
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js"
import pacienteRoutes from "./routes/pacienteRoutes.js"


const app = express();
app.use(express.json());
dotenv.config();
conectarDB();


// Esto ya es configuración necesaria por el paquete de cors
const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback){
        // Menos uno significa el error
        if(dominiosPermitidos.indexOf(origin) !== -1){
            //El origen del request esta permitido
            callback(null, true) //Null viene siendo el error
        }else{
            callback(new Error("No permitido por CORS"))
        }
    }
}

app.use(cors(corsOptions));
app.use(cors({ origin: '*' })) //Igual esto sirve para evitar el problema de cors
app.use("/api/veterinarios", veterinarioRoutes );
app.use("/api/pacientes", pacienteRoutes );


const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log(`Funciona el servidor ${PORT}`)
})