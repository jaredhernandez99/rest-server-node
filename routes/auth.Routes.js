const { Router } = require("express");
const { check } = require("express-validator");

const { login, googleSignIn } = require("../controllers/auth.Controller");
const { validarCampos } = require("../middlewares/validarCampos");

const router = Router()

router.post('/login',[
    check("correo","El correo es obligatorio").isEmail(),
    check("password","El password es obligatorio").not().isEmpty(),
    validarCampos,
], login )

router.post('/google',[
    check('id_token','El id token es necesario').not().isEmpty(),
    validarCampos,
], googleSignIn )



module.exports = router