module.exports = (sequelize, DataTypes) => {
    const { STRING } = DataTypes;
    const Project = sequelize.define('project', {
        title: {
            type: STRING,
            allowNull: false
        },
        details: {
            type: STRING,
            allowNull: false
        }
    });

    Project.associate = models => {
        const { Project, Task } = models;
        Project.hasMany(Task, { onDelete: 'CASCADE', foreignKey: { allowNull: false } });
    };

    return Project;
};
