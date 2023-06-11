const generarId = ()=>{

    //Codigo para generar un id unico
    return Date.now().toString(32) + Math.random().toString(32).substring(2);
}

export default generarId;