const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const Sequelize = require('sequelize');
const { capitalizeFirstLetter } = require('../utils/StringUtils');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];

let db = {};

const sequelize = new Sequelize(config);

fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        const modelClassName = capitalizeFirstLetter(model.name);
        db[modelClassName] = model;
    });

for (const modelName in db) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
}
//Must be done after updating associations
sequelize.sync();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
