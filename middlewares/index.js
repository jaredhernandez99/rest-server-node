const  validaRoles  = require("../middlewares/validar-roles");
const  validarCampos  = require("../middlewares/validarCampos");
const  validarJWT  = require("../middlewares/validarJWT");
const validarArchivo = require("../middlewares/validar-archivo")

module.exports = {
    ...validarCampos,
    ...validaRoles,
    ...validarJWT,
    ...validarArchivo
}