const { Router } = require("express");
const { check } = require("express-validator");
const {
  usuarioGet,
  usuarioPut,
  usuarioPost,
  usuarioDelete,
} = require("../controllers/user.Controller");
const { esRolValido, emailExist,userExistID } = require("../helpers/db-validators");

// const { esAdminRole,hasRole } = require("../middlewares/validar-roles");
// const { validarCampos } = require("../middlewares/validarCampos");
// const { validarJWT } = require("../middlewares/validarJWT");
const {  validarCampos,validarJWT,esAdminRole,hasRole  } = require("../middlewares")


const router = Router();

router.get("/", usuarioGet);

router.put("/:id",[
        check("id", "El id no es válido").isMongoId(),
        check("id").custom(userExistID),
        check("rol").custom( esRolValido ),
        validarCampos
], usuarioPut);

router.post(
  "/",[
        check("nombre", "El nombre no es válido").not().isEmpty(),
        check("correo", "El correo no es válido").isEmail(),
        check("correo").custom( emailExist ),
        check("password", "El password debe de ser mas de 6 letras").isLength({min:6}),
        // check("rol", "No es un rol valido").isIn(['ADMIN_ROLE','USER_ROLE']),
        check("rol").custom( esRolValido ),
        validarCampos
],usuarioPost);

router.delete("/:id",[
  validarJWT,
  esAdminRole,
    hasRole('ADMIN_ROLE','VENTAS_ROLE'),
    check("id", "El id no es válido").isMongoId(),
    check("id").custom(userExistID),
    validarCampos
], usuarioDelete);

module.exports = router;
