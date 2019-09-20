module.exports = (sequelize, DataTypes) => {
    const { STRING } = DataTypes;
    const Task = sequelize.define('task', {
        title: {
            type: STRING,
            allowNull: false
        },
        details: STRING
    });

    Task.associate = models => {
        const { Task, Project } = models;
        Task.belongsTo(Project, { onDelete: 'CASCADE', foreignKey: { allowNull: false } });
        Task.belongsTo(Task, { onDelete: 'CASCADE' });
        Task.hasMany(Task, { onDelete: 'CASCADE' });
    };

    return Task;
};
