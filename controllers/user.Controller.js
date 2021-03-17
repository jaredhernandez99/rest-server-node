const { response, request } = require("express");
const Usuario = require("../models/usuario.Model");
const bcryptjs = require("bcryptjs");

const usuarioGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  //IMPLEMENTACION OPCIONAL PARA VERIFICAR NUMEROS
  if (isNaN(limite) || isNaN(desde)) {
    return res.status(400).json({msg : "peticion invalida"})
  } else {

    const [total, usuarios] = await Promise.all([
      Usuario.countDocuments({estado: true}),
      Usuario.find({estado: true})
      .skip(Number(desde))
      .limit(Number(limite))
    ])

    res.json({ total,usuarios });
  }
};
const usuarioPost = async (req, res = response) => {
  //Al destructurar, solo traemos los requeridos
  //Al hacer esto: const body = req.body, nos trae toda nuestra respuesta
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //ENCRIPTAR LA PWD
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //GUARDA DB
  await usuario.save();
  res.json({ usuario });
};

const usuarioPut = async (req, res = response) => {
  //Params es lo que trae la request
  const { id } = req.params;
  const { _id, password, google, ...resto } = req.body;

  //Validar contra body
  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json(usuario);
};

const usuarioDelete = async(req, res = response) => {
  const { id } = req.params

  //BORRADO FISICAMENTE
  // const usuario = await Usuario.findByIdAndDelete( id )

  //borrado por estado, se pasa valor a false, queda deshabilitado
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false})

  res.json( usuario );
};

module.exports = {
  usuarioGet,
  usuarioPost,
  usuarioPut,
  usuarioDelete,
};
