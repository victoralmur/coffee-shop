const validateFields = require('./validate-fields');
const validateJWT = require('./validate-jwt');
const hasRole = require('./validate-roles');
const validateFile = require('./validate-file');

module.exports = {
    ...validateFields,
    ...validateJWT,
    ...hasRole,
    ...validateFile
}