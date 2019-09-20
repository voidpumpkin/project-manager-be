const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const Sequelize = require('sequelize');
const { capitalizeFirstLetter } = require('../utils/StringUtils');

let db = {};

const sequelize = new Sequelize('sqlite:./project_manager_db.db');

fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        const modelClassName = capitalizeFirstLetter(model.name);
        db[modelClassName] = model;
    });

//FIXME: Should use migrations
sequelize.sync();

for (modelName in db) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
