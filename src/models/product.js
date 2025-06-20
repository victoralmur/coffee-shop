const { Schema, model } = require('mongoose');

const productschema = Schema({
    Name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    Status: {
        type: Boolean,
        default: true
    },
    idUser: {
        //Es un ObjectId de MongoDB, es un uuid
        type: Schema.Types.ObjectId,
        //La referencia tiene que tener el mismo nombre del modelo:  model('User', userSchema);
        ref: 'User',
        required: true
    },
    Price: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },
    idCategory: {
        //Es un ObjectId de MongoDB, es un uuid
        type: Schema.Types.ObjectId,
        //La referencia tiene que tener el mismo nombre del modelo:  model('Categorie', categorySchema)
        ref: 'Categorie',
        required: true
    },
    Description: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    Available: {
        type: Boolean,
        default: true
    },
    Image: {
        type: String
    }
});

productschema.methods.toJSON = function(){
    const { __v, _id, ...product } = this.toObject();

    product.uuid = _id;

    return product;
}

module.exports = model('Product', productschema);