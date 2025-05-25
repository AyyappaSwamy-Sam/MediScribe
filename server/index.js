const Db = require('./Services/DataBase/DatabaseConnection');
require('dotenv').config()

const config = require('./Common/config/Config');

console.log('df',config.MONGO_URI);
Db();