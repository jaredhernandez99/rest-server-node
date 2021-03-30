const { response } = require("express");
const Usuario = require("../models/usuario.Model");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { correo, password } = req.body;
  try {
    //VERIFICAR SI EL EMAIL EXISTE
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res
        .status(400)
        .json({ msg: "Usuario / Password no son correctos -- correo " });
    }

    //SI EL USUARIO ESTA ACTIVO
    if (!usuario.estado) {
      return res
        .status(400)
        .json({ msg: "Usuario no valido - estado: False " });
    }

    //VERIFICAR LA CONTRASEÑA
    const validPwd = bcryptjs.compareSync(password, usuario.password);
    if (!validPwd) {
      return res.status(400).json({ msg: "Usuario no valido - PWD: False " });
    }

    //CREAR JWT
    const token = await generarJWT(usuario.id);

    res.json({ msg: usuario, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Algo salio mal - authCtrl" });
  }

  const logout = async (req, res) => {
    if (req.headers.authorization == "Bearer") {
      return res.status(403).send({
        status: "error",
        message: "No tienes permiso para estar aqui, favor de loguearse",
      });
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      req.headers.authorization = " ";
    }

    return res.status(200).send({
      status: "success",
      message: "Has cerrado sesion correctamente",
    });
  };
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;
  try {
    const { correo, nombre, img } = await googleVerify(id_token);
    let usuario = await Usuario.findOne({correo})
    if(!usuario){
      //Lo creamos
      const data = {
        nombre,
        correo,
        password: ':P',
        img,
        google: true
      }
      usuario = new Usuario( data )
      await usuario.save();
    }

    //si el usuario en BORRADO
    if(!usuario.estado){
      return res.status(401).json({
        msg: 'Contactar al administrador, usuario eliminado'
      })
    }

    //GENERAR JWT
    const token = await generarJWT( usuario.id )

    res.json({
      usuario,
      token
    });
  } catch (error) {
    res.status(400).json({
      msg: "Token no valido",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
