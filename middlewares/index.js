const  validaRoles  = require("../middlewares/validar-roles");
const  validarCampos  = require("../middlewares/validarCampos");
const  validarJWT  = require("../middlewares/validarJWT");

module.exports = {
    ...validarCampos,
    ...validaRoles,
    ...validarJWT
}