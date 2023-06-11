import jwt from 'jsonwebtoken';
const generarJWT = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        //Para que el token expire en 30 dias
        expiresIn: "30d",
    })

}

export default generarJWT;