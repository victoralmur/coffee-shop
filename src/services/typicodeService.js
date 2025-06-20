const { request, response } = require("express");
const axios = require('axios');

const url = 'https://jsonplaceholder.typicode.com/users';

const getTypeCode = async (req = request, res = response) => {

    try {
        const typicodeResponse = await axios.get(url);
        const dataResponse = typicodeResponse.data;

        res.status(200).json(dataResponse);
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            error: 'Hubo problemas al consumir el servicio typicode'
        });
    }
}

module.exports = {
    getTypeCode
}