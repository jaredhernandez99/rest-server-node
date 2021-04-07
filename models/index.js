// De esta manera se simplifica los require en los archivos principales

const Categoria = require("./categoria.Model");
const Producto = require("./producto.Model");
const Role = require("./rol.Modelo");
const Server = require("./server.Model");
const Usuario = require("./usuario.Model");

module.exports = {
    Categoria,
    Producto,
    Role,
    Server,
    Usuario,
};

