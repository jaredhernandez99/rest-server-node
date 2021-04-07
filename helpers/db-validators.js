const Rol = require("../models/rol.Modelo");
const { Usuario, Categoria, Producto } = require("../models/");

const esRolValido = async (rol = "") => {
  const rolExiste = await Rol.findOne({ rol });
  if (!rolExiste) {
    throw new Error(`El rol ${rol} no esta registrado en la BD`);
  }
};

const emailExist = async (correo) => {
  const existe = await Usuario.findOne({ correo });
  if (existe) {
    throw new Error("El correo ya ha sido registrado, desea iniciar sesion?");
  }
};

const userExistID = async (id) => {
  const existeUsuarioID = await Usuario.findById(id);
  if (!existeUsuarioID) {
    throw new Error("El id no existe - userExistID");
  }
};

const existeCategoria = async (id) => {
  const existecategoria = await Categoria.findById(id);
  if (!existecategoria){
      throw new Error(`La categoria con id ${id} no existe `)
  }
};

const existeProducto = async (id) => {
  const existeproducto = await Producto.findById(id);
  if (!existeproducto){
      throw new Error(`El producto con id ${id} no existe `)
  }
};

module.exports = {
  esRolValido,
  emailExist,
  userExistID,
  existeCategoria,
  existeProducto
};
