const express = require("express");
const cors = require("cors")

class Server {
  constructor() {
    this.app    = express();
    this.port   = process.env.PORT
    this.userRoute = '/api/users'

    //Middlewares
    this.middlewares()
    //RUTAS DE MI APP
    this.routes()
  }

  middlewares() {
    //CORS
    this.app.use(cors())
    //JSON - LECTURA Y PARSEO
    this.app.use(express.json())
    //Middleware de directorio publico
    this.app.use(express.static('public'))
  }

  routes() {
    this.app.use(this.userRoute,require('../routes/user.Routes'))
  }
  listen(){
    this.app.listen(this.port,()=>{
        console.log('servidor corriendo en el puerto: ', this.port);
    })
  }
}

module.exports = Server;
