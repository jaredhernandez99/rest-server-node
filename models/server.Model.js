const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const { dbConnect } = require("../database/config.DB");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      buscar: "/api/buscar",
      categorias: "/api/categorias",
      productos: "/api/productos",
      uploads: "/api/uploads",
      usuarios: "/api/usuarios",
    };
    //CONEXION DB
    this.conectardb();

    //Middlewares
    this.middlewares();
    //RUTAS DE MI APP
    this.routes();
  }
  async conectardb() {
    await dbConnect();
  }
  middlewares() {
    //CORS
    this.app.use(cors());
    //JSON - LECTURA Y PARSEO
    this.app.use(express.json());
    //Middleware de directorio publico
    this.app.use(express.static("public"));
    //Middleware para carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth.Routes"));
    this.app.use(this.paths.buscar, require("../routes/buscar.Routes"));
    this.app.use(this.paths.categorias, require("../routes/categoria.Routes"));
    this.app.use(this.paths.productos, require("../routes/productos.Routes"));
    this.app.use(this.paths.uploads, require("../routes/upload.Routes"));
    this.app.use(this.paths.usuarios, require("../routes/user.Routes"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log("servidor corriendo en el puerto: ", this.port);
    });
  }
}
module.exports = Server;
