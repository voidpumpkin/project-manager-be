module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        details: DataTypes.STRING
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
