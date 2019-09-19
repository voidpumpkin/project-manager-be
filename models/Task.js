module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('task', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        details: DataTypes.STRING
    });
    return Task;
};
