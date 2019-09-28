module.exports = (sequelize, DataTypes) => {
    const { STRING, BOOLEAN } = DataTypes;
    const User = sequelize.define('user', {
        username: {
            type: STRING,
            allowNull: false
        },
        password: {
            type: STRING,
            allowNull: false
        },
        isSystemAdmin: {
            type: BOOLEAN,
            allowNull: false
        }
    });

    User.associate = models => {
        const { Project, ProjectParticipator } = models;
        //Is manager of
        User.hasMany(Project, {
            as: 'managedProject',
            foreignKey: {
                name: 'managerId',
                allowNull: false,
                references: {
                    model: User,
                    key: 'id'
                }
            }
        });
        //Participates in
        User.belongsToMany(Project, {
            as: 'project',
            through: {
                model: ProjectParticipator,
                unique: false
            },
            foreignKey: {
                name: 'participatorId',
                allowNull: false,
                references: {
                    model: User,
                    key: 'id'
                }
            }
        });
    };

    return User;
};
