const { request, response } = require("express")

//Los valores del parametro van como array
const hasRole = (...roles) => {

    return (req = request, res = response, next) => {
        //Obtengo el valor de la req (request)
        //req.user viene del metodo validarJWT
        if(!req.user){
            return res.status(500).json({
                error: 'Se quiere verificar el usuario, sin validar el token'
            });
        }

        const { userName, Role } = req.user;

        if(!roles.includes(Role)){
            return res.status(401).json({
                error: `${userName} no tiene permisos`
            });
        }

        next();
    }
}

module.exports = {
    hasRole
}