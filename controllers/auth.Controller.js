const { response } = require("express");
const Usuario = require("../models/usuario.Model")
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generarJWT");

const login = async(req,res = response) =>{

    const { correo,password } = req.body
    try {

        //VERIFICAR SI EL EMAIL EXISTE
        const usuario = await Usuario.findOne({correo})
        if(!usuario){
            return res.status(400).json({msg: "Usuario / Password no son correctos -- correo "})

        }

        //SI EL USUARIO ESTA ACTIVO
        if(!usuario.estado){
            return res.status(400).json({msg : "Usuario no valido - estado: False "})
        }

        //VERIFICAR LA CONTRASEÑA
        const validPwd = bcryptjs.compareSync( password, usuario.password)
        if(!validPwd){
            return res.status(400).json({msg : "Usuario no valido - PWD: False "})
        }

        //CREAR JWT
        const token = await generarJWT( usuario.id )


        res.json({ msg : usuario,token})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg :"Algo salio mal - authCtrl"})
    }






}


module.exports = {
    login
};
