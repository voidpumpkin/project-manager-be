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
        const { Task } = models;
        //Has substasks
        Task.hasMany(Task, {
            as: 'subtask',
            onDelete: 'CASCADE',
            foreignKey: { references: { model: 'tasks', key: 'id' } }
        });
    };

    return Task;
};
