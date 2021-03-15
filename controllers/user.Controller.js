const { response, request } = require("express");

const usuarioGet = (req = request, res = response) => {
  const {q} = req.query;
  res.json({ 
      ok: true, 
      msg: "hola keso - CONTROLLER",
      q
    });
};

const usuarioPost = (req, res = response) => {
  //Al destructurar, solo traemos los requeridos
  //Al hacer esto: const body = req.body, nos trae toda nuestra respuesta
  const { nombre, edad } = req.body;
  res.json({
    ok: true,
    msg: "post keso - CONTROLLER",
    nombre,
    edad,
  });
};

const usuarioPut = (req, res = response) => {
  //Params es lo que trae la request
  const id = req.params.id;
  res.json({
    ok: true,
    msg: "put keso - CONTROLLER",
    id,
  });
};

const usuarioDelete = (req, res = response) => {
  res.json({ ok: true, msg: "delete keso - CONTROLLER" });
};

module.exports = {
  usuarioGet,
  usuarioPost,
  usuarioPut,
  usuarioDelete,
};
