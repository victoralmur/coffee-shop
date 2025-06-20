const { Schema, model } = require('mongoose');

const userSchema = Schema({
    userName: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio']
    },
    Name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    Email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    Password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    Role: {
        type: String,
        required: [true, 'El rol es obligatorio'],
        enum: ['ADMIN', 'USER']
    },
    Image: {
        type: String
    },
    Status: {
        type: Boolean,
        default: true
    }
});

//Tiene que ser una funcion normal, porque se usara el this
userSchema.methods.toJSON = function(){
    //this.toObject() genera la instancia del objeto
    //por ello podemos realizar la desestructuracion del objeto
    const { __v, Password, _id, ...user } = this.toObject();

    user.uuid = _id;
    
    return user;
}

//Primer parametro: Mongoose añade la s al modelo, en este caso User, sera Users
//Segundo parametro: Se coloca el esquema
module.exports = model('User', userSchema);