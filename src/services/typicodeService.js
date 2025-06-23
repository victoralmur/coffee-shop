const { request, response } = require("express");
const axios = require('axios');

const url = 'https://jsonplaceholder.typicode.com/users';

const getTypicodeService = async () => {

    const typicodeResponse = await axios.get(url);
    const dataResponse = typicodeResponse.data;

    return dataResponse;
}

module.exports = {
    getTypicodeService
}