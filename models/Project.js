module.exports = (sequelize, DataTypes) => {
    const { STRING } = DataTypes;
    const Project = sequelize.define('project', {
        title: {
            type: STRING,
            allowNull: false
        },
        details: STRING
    });

    return Project;
};
