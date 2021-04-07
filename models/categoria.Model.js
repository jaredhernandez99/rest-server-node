const {Schema,model} = require("mongoose")


const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    //Object id se ocupa para traer otro objeto de otra colección
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})

//lo que no ocuparemos de la categoria
CategoriaSchema.methods.toJSON = function(){
    const {__v,estado, ...data} = this.toObject()
    return data

}

module.exports = model( 'Categoria',CategoriaSchema)
