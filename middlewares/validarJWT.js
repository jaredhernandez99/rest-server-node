const { response, request} = require("express")

const jwt = require("jsonwebtoken")
const Usuario = require("../models/usuario.Model")

const validarJWT = async(req=request,res=response, next) =>{

    const token = req.header('x-token')

    if( !token ){
        return res.status(401).json({msg:"No hay token"})
    }

    try {
        const {uid} = jwt.verify(token,process.env.SECRETORPUBLICKEY)

        //LEER EL USUARIO QUE CORRESPONDE AL UID
        const usuario = await Usuario.findById( uid )

        if(!usuario){
            return res.status(401).json({msg:"token no valido - Usuario no existe en BD"})
        }

        //Verificar si el uid tiene estado true
        if(!usuario.estado){
            return res.status(401).json({msg:"Token no valido -ESTADO ES FALSE"})
        }

        req.usuario = usuario

        next()
    } catch (error) {
        console.log(error);
        res.status(401).json({msg: "token no valido"})
        
    }




}

module.exports = {
    validarJWT
};
