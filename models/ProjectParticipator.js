module.exports = (sequelize, DataTypes) => {
    const ProjectParticipator = sequelize.define('projectParticipator', {
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'projects',
                key: 'id'
            }
        },
        participatorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    });
    return ProjectParticipator;
};
