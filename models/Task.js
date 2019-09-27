module.exports = (sequelize, DataTypes) => {
    const { STRING } = DataTypes;
    const Task = sequelize.define('task', {
        title: {
            type: STRING,
            allowNull: false
        },
        details: {
            type: STRING,
            allowNull: false
        }
    });

    Task.associate = models => {
        const { Task, Project } = models;
        Task.belongsTo(Project, {
            onDelete: 'CASCADE',
            foreignKey: { allowNull: false, references: { model: 'tasks', key: 'id' } }
        });
        Task.belongsTo(Task, {
            onDelete: 'CASCADE',
            foreignKey: { references: { model: 'tasks', key: 'id' } }
        });
        Task.hasMany(Task, {
            onDelete: 'CASCADE',
            foreignKey: { references: { model: 'tasks', key: 'id' } }
        });
    };

    return Task;
};
