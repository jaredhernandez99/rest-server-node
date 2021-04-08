const { Router } = require("express");
const { check } = require("express-validator");
const { cargarArchivo, actualizarImg, mostrarImg, actualizarImgCloudinary } = require("../controllers/upload.Controller");
const { coleccionesPermitidas } = require("../helpers");
const { validarCampos, validarArchivoSubir } = require("../middlewares/");


const router = Router()

router.post('/',validarArchivoSubir, cargarArchivo)

router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check("id", "El id no es un mongoId valido").isMongoId(),
    check("coleccion").custom(c => coleccionesPermitidas(c,['usuarios','productos']) ),
    validarCampos
],actualizarImgCloudinary)

router.get('/:coleccion/:id',[
    check("id", "El id no es un mongoId valido").isMongoId(),
    check("coleccion").custom(c => coleccionesPermitidas(c,['usuarios','productos']) ),
    validarCampos
],mostrarImg)

module.exports = router