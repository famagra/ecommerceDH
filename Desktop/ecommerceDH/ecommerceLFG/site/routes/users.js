var express = require("express");
var router = express.Router();
const usercontroller = require("../controllers/userController");
const indexControlller = require("../controllers/indexController");
const adminMiddleware = require("../middleware/adminMiddleware");
const multer = require("multer");
const path = require("path");
const { check, validationResult, body } = require("express-validator");
const guestMiddleware = require("../middleware/guestMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

/*-------------------------MULTER PARA CARGAR IMAGENES AL PERFIL DEL USUARIO-----------------------------*/
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/users");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
var upload = multer({ storage: storage });

router.get("/", guestMiddleware, (req, res) => {
  res.render("login", { usuario: req.session.usuarioLogueado });
});

router.post(
  "/",
  [
    check("email").isEmail().withMessage("ingrese un email válido"),
    check("password")
      .isLength({ min: 3 })
      .withMessage("La password debe tener 4 caracteres"),
  ],
  usercontroller.login_post
);

router.get("/register", guestMiddleware, usercontroller.registrar);

router.post(
  "/register",
  upload.single("avatar"),
  usercontroller.guardarUsuario
);

router.get("/list", usercontroller.listUsers);

router.get("/edit/:id", usercontroller.editUser);

router.put("/edit/:id", usercontroller.editar_post);
router.delete("/edit/:id", usercontroller.borrar);

router.get("/profile", authMiddleware, usercontroller.userProfile);

router.get("/admin", (req, res) => {
  res.render("portalAdmin", { usuario: req.session.usuarioLogueado });
});

/*-------------------------SIRVE PARA CONTROL DE SABER SI EL USUARIO ESTA LOGUEADO ----METODO GET--------------------------------*/
router.get("/check", function (req, res) {
  if (req.session.usuarioLogueado == undefined) {
    res.send("EL USUARIO NO ESTA LOGUEADO");
  }
  res.send("EL USUARIO LOGUEADO ES: " + req.session.usuarioLogueado.email);
});

/*-------------------------CERRAR SESION DEL USUARIO ----METODO GET--------------------------------*/
router.get("/logout", function (req, res) {
  req.session.destroy();
  return res.redirect("../");
  //return res.send("LA SESIÓN DEL USUARIO A TERMINADO")
});

/* ruta a admin por get - verifica si es administrador - test para usar middleware */
//router.get("/admin", adminMiddleware, usercontroller.searchAdmin);

/* ruta a listado de usuarios*/

module.exports = router;
