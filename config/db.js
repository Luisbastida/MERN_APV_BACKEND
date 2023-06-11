import mongoose from "mongoose";

const conectarDB = async () =>{

    try {
        // Se usa la última variable para no poner toda la url de mongo que se encuentra en el archivo env
        const db = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MondogDb conectado en: ${url}`);
    } catch (error) {
        console.log(`error: ${error}`);
        process.exit(1)
    }

}
export default conectarDB;