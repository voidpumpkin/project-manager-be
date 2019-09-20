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
        models.Task.belongsTo(models.Project, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Task;
};
