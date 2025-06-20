const { Schema, model } = require('mongoose');

const categorySchema = Schema({
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
        //La referencia tiene que tener el mismo nombre del modelo:  model('User', userSchema)
        ref: 'User',
        required: true
    }
});

categorySchema.methods.toJSON = function(){
    const { __v, _id, ...category } = this.toObject();

    category.uuid = _id;

    return category;
}

module.exports = model('Categorie', categorySchema);