module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('project', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        details: DataTypes.STRING
    });

    return Project;
};
