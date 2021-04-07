const { response } = require("express");
const { Producto } = require("../models")

//obtenerProductos - paginado - total de categorias - populate
//TODO: Implementar paginado desde funcion
const obtenerProductos  = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    //IMPLEMENTACION OPCIONAL PARA VERIFICAR NUMEROS
    if (isNaN(limite) || isNaN(desde)) {
      return res.status(400).json({msg : "peticion invalida"})
    } else {
  
      const [total, productos] = await Promise.all([
        Producto.countDocuments({estado: true}),
        Producto.find({estado: true})
                 .populate('usuario','nombre')
                 .populate('categoria','nombre')

        .skip(Number(desde))
        .limit(Number(limite))
      ])

      if(!total){
        return res.json("No hay productos")
      }
  
      res.json({ total,productos });
    }
  }

const  obtenerProducto = async(req, res = response)=> {
  const {id} = req.params
  const producto = await Producto.findById(id).populate('usuario', 'nombre' ).populate('categoria','nombre')
  res.json(producto)
}
//La categoria del producto es un select
const crearProducto = async (req, res = response) => {
try {
  
    const { estado,usuario, ...body } = req.body
    //Verifica si el producto ya existe en BD
    const nombre = body.nombre.toUpperCase()
    const productoDB = await Producto.findOne({nombre})
    if(productoDB){
        return res.status(400).json({ msg: `El producto ${productoDB.nombre} ya existe en BD!`})
    }

    const data = { 
      ...body, 
      nombre:   nombre.toUpperCase(),
      usuario:  req.usuario._id
    }
    const producto = await new Producto( data )
    await producto.save()
    res.status(201).json(producto)
    
} catch (error) {
  console.log(error);
}

}

const actualizarProducto = async(req, res = response) => {
 try {
  const {id} = req.params
  const { usuario,estado, ...data } = req.body
  data.nombre = data.nombre.toUpperCase()
  data.usuario = req.usuario._id

  const producto = await Producto.findByIdAndUpdate(id, data, {new: true})

  res.json(producto)
 } catch (error) {
    console.log(error);
 }
}

const borrarProducto = async (req, res = response) => {
//TODO: BORRAR DESPUES DE X TIEMPO DE BD PERMANENTEMENTE
try {
  const { id } = req.params
  const productoBorrado = await Producto.findByIdAndUpdate(id,{estado: false, disponible: false},{new: true})

  res.json( productoBorrado )
} catch (error) {
  console.log(error);
}
}





module.exports = {
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
    crearProducto
};
