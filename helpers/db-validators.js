const Rol = require("../models/rol.Modelo");
const Usuario = require('../models/usuario.Model')



const esRolValido = async(rol = '')=>{
    const rolExiste = await Rol.findOne({rol})
    if(!rolExiste){
            throw new Error(`El rol ${rol} no esta registrado en la BD`)
    }
}


const emailExist = async(correo) =>{
    const existe = await Usuario.findOne({correo})
    if(existe){
        throw new Error("El correo ya ha sido registrado, desea iniciar sesion?")
    }
}

const userExistID = async(id) =>{
    const existeUsuarioID = await Usuario.findById(id)
    if(!existeUsuarioID){
        throw new Error("El id no existe - userExistID")
    }
}



module.exports = {
    esRolValido,
    emailExist,
    userExistID
};
