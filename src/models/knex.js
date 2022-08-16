const environment = process.env.NODE_ENV || 'development';
const config = require('../../knexfile')[environment];
// console.log(config, 'knex.js');
module.exports = require('knex')(config);