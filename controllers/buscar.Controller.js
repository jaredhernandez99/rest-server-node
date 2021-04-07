const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = ["categorias", "productos", "roles", "usuarios"];


/**
 * 
 * @param termino: El termino de busqueda que solicitamos a la BD 
 * @param res: Respuesta a retornar  
 * @returns retorna la busqueda de un usuario en nuestra BD con busquedas insensibles
 */
const buscarUsuarios = async (termino = "", res = response) => {
  try {
    const isMongoID = ObjectId.isValid(termino); //bool

    if (isMongoID) {
      const usuario = await Usuario.findById(termino);
      return res.json({
        results: usuario ? [usuario] : [],
      });
    }

    const regex = new RegExp(termino, "i");

    const usuarios = await Usuario.find({
      $or: [{ nombre: regex }, { correo: regex }],
      $and: [{ estado: true }],
    });

    res.json({
      results: usuarios,
    });
  } catch (error) {
    console.log(error);
  }
};


/**
 * 
 * @param termino: El termino de busqueda que solicitamos a la BD 
 * @param res: Respuesta a retornar  
 * @returns retorna la busqueda de un usuario en nuestra BD con busquedas insensibles
 */
const buscarProductos = async (termino = "", res = response) => {
    try {
      const isMongoID = ObjectId.isValid(termino); //bool
  
      if (isMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
          results: producto ? [producto] : [],
        });
      }
  
      const regex = new RegExp(termino, "i");
  
      const productos = await Producto.find( {  nombre: regex, estado: true  } ).populate('categoria', 'nombre');
  
      res.json({
        results: productos,
      });
    } catch (error) {
      console.log(error);
    }
  };


/**
 * 
 * @param termino: El termino de busqueda que solicitamos a la BD 
 * @param res: Respuesta a retornar  
 * @returns retorna la busqueda de un usuario en nuestra BD con busquedas insensibles
 */
 const buscarCategorias = async (termino = "", res = response) => {
    try {
      const isMongoID = ObjectId.isValid(termino); //bool
  
      if (isMongoID) {
        const categoria = await Categoria.findById(termino).populate('usuario', 'nombre');
        return res.json({
          results: categoria ? [categoria] : [],
        });
      }
  
      const regex = new RegExp(termino, "i");
  
      const categorias = await Categoria.find({  nombre: regex, estado: true  }).populate('usuario', 'nombre');
  
      res.json({
        results: categorias,
      });
    } catch (error) {
      console.log(error);
    }
  };




const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;

  //Valida las colecciones permitidas en las busquedas
  if (!coleccionesPermitidas.includes(coleccion)) {
    //TODO: Especificar mas el mensaje de error
    return res
      .status(400)
      .json({
        msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
      });
  }

  switch (coleccion) {
    case "categorias":
      buscarCategorias(termino, res)
      break;

    case "productos":
      buscarProductos(termino,res)
      break;

    case "usuarios":
      buscarUsuarios(termino, res);
      break;

    default:
      res.status(500).json({
        msg: "Se me olvido hacer la busqueda",
      });
  }
};

module.exports = {
  buscar,
};
