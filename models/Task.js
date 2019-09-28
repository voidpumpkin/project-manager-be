module.exports = (sequelize, DataTypes) => {
    const { STRING, BOOLEAN } = DataTypes;
    const Task = sequelize.define('task', {
        title: {
            type: STRING,
            allowNull: false
        },
        details: {
            type: STRING,
            allowNull: false
        },
        isDone: {
            type: BOOLEAN,
            allowNull: false
        }
    });

    Task.associate = models => {
        const { Task, Project } = models;
        //Is task of
        Task.belongsTo(Project, {
            onDelete: 'CASCADE',
            foreignKey: { allowNull: false, references: { model: 'tasks', key: 'id' } }
        });
        //Is subtask of
        Task.belongsTo(Task, {
            onDelete: 'CASCADE',
            foreignKey: { references: { model: 'tasks', key: 'id' } }
        });
        //Has substasks
        Task.hasMany(Task, {
            onDelete: 'CASCADE',
            foreignKey: { references: { model: 'tasks', key: 'id' } }
        });
    };

    return Task;
};
