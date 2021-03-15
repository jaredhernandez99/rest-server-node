// 
require('dotenv').config()
// 
const Server = require('./models/server.Model')
// 
const server = new Server()

server.listen()