const { Router } = require("express");
const { check } = require("express-validator");

const { crearProducto,
        obtenerProductos,
        obtenerProducto,
        actualizarProducto,
        borrarProducto } = require("../controllers/producto.Controller");

const { existeCategoria, existeProducto } = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares/");

const router = Router();

//Obtener todas las categorias - PUBLICO
router.get("/", obtenerProductos);

//Obtener un Producto por ID - PUBLICO
//TODO: SIGUE MOSTRANDO ELEMENTOS EN FALSE 
router.get("/:id", 
[
  check('id','No es un id de Mongo Valido').isMongoId(),
  check('id').custom(existeProducto),
  validarCampos
],obtenerProducto);

// //Crear categoria - PRIVADO - CUALQUIER PERSONA CON UN TOKEN VALIDO
router.post(
  "/",
    [
    validarJWT, 
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "No es un id de Mongo valido").isMongoId(),
    check("categoria").custom(existeCategoria),
    validarCampos
],crearProducto
);

// //Actualizar categoria - PRIVADO - CUALQUIER PERSONA CON UN TOKEN VALIDO
router.put("/:id", [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('id','No es un id de Mongo Valido').isMongoId(),
  check('id').custom(existeProducto),
  validarCampos
] ,actualizarProducto);

// //Borrar categoria - SOLO ADMIN PASAR ESTADO A FALSE
router.delete("/:id", [
  validarJWT, 
  esAdminRole,
  check('id','No es un id de Mongo Valido').isMongoId(),
  check('id').custom(existeProducto),
  validarCampos

], borrarProducto);

module.exports = router;