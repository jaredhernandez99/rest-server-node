const path = require("path")
const fs = require("fs")

const cloudinary = require("cloudinary").v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { response } = require("express");
const { subirArchivo } = require("../helpers/");
const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req, res = response) => {
  
  try {
    const nombre = await subirArchivo(req.files, undefined, "imgs");

    res.json({ nombre });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const actualizarImg = async(req, res = response) => {
  const {coleccion,id } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
        modelo = await Usuario.findById(id)
        if(!modelo){
            return res.status(400).json({ 
                msg : `No existe un usuario con el id ${id}`
            })
        }
      break;
    case 'productos':
        modelo = await Producto.findById(id)
        if(!modelo){
            return res.status(400).json({ 
                msg : `No existe un producto con el id ${id}`
            })
        }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvido validar esto" });
  }

  //LIMPIAR IMAGENES PREVIAS
  if(modelo.img){
    //Borrar la imagen del servidor
    const pathImg = path.join( __dirname, '../uploads',coleccion, modelo.img )
    if(fs.existsSync(pathImg)){
      fs.unlinkSync(pathImg)
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);

  modelo.img = nombre;
  await modelo.save()

  res.json(modelo);
};
// =================================================================
const actualizarImgCloudinary = async(req, res = response) => {
  const {coleccion,id } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
        modelo = await Usuario.findById(id)
        if(!modelo){
            return res.status(400).json({ 
                msg : `No existe un usuario con el id ${id}`
            })
        }
      break;
    case 'productos':
        modelo = await Producto.findById(id)
        if(!modelo){
            return res.status(400).json({ 
                msg : `No existe un producto con el id ${id}`
            })
        }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvido validar esto" });
  }

  //LIMPIAR IMAGENES PREVIAS
  if(modelo.img){
      const nombreArr = modelo.img.split('/')
      const nombre = nombreArr[nombreArr.length -1]
      const [ public_id ] = nombre.split('.')
      cloudinary.uploader.destroy( public_id )

  }
    const {tempFilePath} = req.files.archivo
    const {secure_url} = await cloudinary.uploader.upload( tempFilePath )
    modelo.img = secure_url;
    await modelo.save()



  res.json(modelo);
};


const mostrarImg = async(req, res = response) => {
  
  const {coleccion,id } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
        modelo = await Usuario.findById(id)
        if(!modelo){
            return res.status(400).json({ 
                msg : `No existe un usuario con el id ${id}`
            })
        }
      break;
    case 'productos':
        modelo = await Producto.findById(id)
        if(!modelo){
            return res.status(400).json({ 
                msg : `No existe un producto con el id ${id}`
            })
        }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvido validar esto" });
  }

  //LIMPIAR IMAGENES PREVIAS
  if(modelo.img){
    //Borrar la imagen del servidor
    const pathImg = path.join( __dirname, '../uploads',coleccion, modelo.img )
    if(fs.existsSync(pathImg)){
      return res.sendFile(pathImg)
    }
  }
  const pathnoImg = path.join( __dirname, '../assets','no-image.jpg' )
    return res.sendFile(pathnoImg)
}


module.exports = {
  cargarArchivo,
  actualizarImg,
  mostrarImg,
  actualizarImgCloudinary
};
