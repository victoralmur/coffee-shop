const { request, response } = require("express");

const wildcard = (req = request, res = response) => {
    const result = '404 | Pagina no encotrada';

    res.status(404).json({
        result
    });
}

module.exports = {
    wildcard
}