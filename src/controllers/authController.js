//request y response para tener intellisense
const { request, response } = require('express');
const { generateJWT, parseJWT } = require('../helpers/generate-jwt');
const bcryptjs = require('bcryptjs');

const { User } = require('../models');

const login = async (req = request, res = response) => {
    try {
        const { Email, Password } = req.body;

        //Verificar si el email existe
        const user = await User.findOne({ Email });

        if(!user){
            return res.status(400).json({
                error: 'El Email o contraseña no son correctos'
            });
        }

        //Si el usuario esta activo
        if(!user.Status){
            return res.status(400).json({
                error: 'El Email o contraseña no son correctos'
            });
        }

        //Verificar la contraseña
        //Compara la contraseña en plano Password y la encripta, con la contraseña que esta en la base de datos user.Password
        const validaPassword = bcryptjs.compareSync(Password, user.Password);

        if(!validaPassword){
            return res.status(400).json({
                error: 'El Email o contraseña no son correctos'
            });
        }
        
        //Generar el JWT
        //Se utiliza id o _id
        //El resultado es el JWT
        const token = await generateJWT(user._id);

        res.status(200).json({
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Hubo problemas con la solicitud'
        });
    }
}

const refreshJWT = async (req = request, res = response) => {
    try {
        const header = req.header('Authorization') || '';
        
        if(!header){
            return res.status(401).json({
                error: 'No existe un token en la peticion'
            });
        }

        const arrayToken = header.split(' ');

        if(arrayToken.length !== 2 || arrayToken[0] !== 'Bearer' || !arrayToken[1]){
            return res.status(401).json({
                error: 'El token no tiene el formato correcto'
            });
        }
        
        //Obtenemos el uuid del token caducado
        const { uuid } = parseJWT(arrayToken[1]);

        const token = await generateJWT(uuid);

        res.status(200).json({
            token
        });

    } catch (error) {
        console.log(error);
        res.status(401).json({
            error: 'Token no valido'
        });
    }
}

module.exports = {
    login,
    refreshJWT
}