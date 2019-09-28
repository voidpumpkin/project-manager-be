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
        const { Project, User, Task, ProjectParticipator } = models;
        //Has tasks
        Project.hasMany(Task, {
            as: 'task',
            onDelete: 'CASCADE',
            foreignKey: { allowNull: false }
        });
        //Has participators
        Project.belongsToMany(User, {
            as: 'participator',
            through: {
                model: ProjectParticipator,
                unique: false
            },
            foreignKey: {
                name: 'projectId',
                references: {
                    model: Project,
                    key: 'id'
                }
            }
        });
    };

    return Project;
};
