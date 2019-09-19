const Task = (sequelize, DataTypes) => {
    return sequelize.define('task', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        details: {
            type: DataTypes.STRING
            // allowNull defaults to true
        }
    });
};
module.exports = Task;
