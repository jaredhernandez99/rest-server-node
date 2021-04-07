const { Router } = require("express");
const { check } = require("express-validator");

const { crearCategoria,
        obtenerCategorias,
        obtenerCategoria,
        actualizarCategoria,
        borrarCategoria } = require("../controllers/categoria.Controller");

const { existeCategoria } = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares/");

const router = Router();

//Obtener todas las categorias - PUBLICO
router.get("/", obtenerCategorias);

//Obtener una categoria por ID - PUBLICO
router.get("/:id", 
[
  check('id','No es un id de Mongo Valido').isMongoId(),
  check('id').custom(existeCategoria),
  validarCampos
],obtenerCategoria);

//Crear categoria - PRIVADO - CUALQUIER PERSONA CON UN TOKEN VALIDO
router.post(
  "/",
    [
    validarJWT, 
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos
    ],crearCategoria
);

//Actualizar categoria - PRIVADO - CUALQUIER PERSONA CON UN TOKEN VALIDO
router.put("/:id", [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('id').custom(existeCategoria),
  validarCampos
] ,actualizarCategoria);

//Borrar categoria - SOLO ADMIN PASAR ESTADO A FALSE
router.delete("/:id", [
  validarJWT, 
  esAdminRole,
  check('id','No es un id de Mongo Valido').isMongoId(),
  check('id').custom(existeCategoria),
  validarCampos

], borrarCategoria);

module.exports = router;
