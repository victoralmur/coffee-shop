const { request, response } = require("express");
const { getTypicodeService } = require("../services/typicodeService");

const getTypicode = async (req = request, res = response) => {
    try {
        const typicodeResponse = await getTypicodeService();

        res.status(200).json(typicodeResponse);
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            error: 'Hubo problemas al consumir el servicio typicode'
        });
    }
}

module.exports = {
    getTypicode
}