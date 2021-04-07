const { Router } = require("express");
const { buscar } = require("../controllers/buscar.Controller");

const router = Router()

router.get('/:coleccion/:termino',buscar)


module.exports = router
