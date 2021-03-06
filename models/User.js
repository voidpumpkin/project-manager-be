module.exports = (sequelize, DataTypes) => {
    const { STRING } = DataTypes;
    const User = sequelize.define('user', {
        username: {
            type: STRING,
            allowNull: false
        },
        password: {
            type: STRING,
            allowNull: false
        },
        companyName: {
            type: STRING
        },
        firstName: {
            type: STRING,
            allowNull: false
        },
        lastName: {
            type: STRING,
            allowNull: false
        },
        email: {
            type: STRING,
            allowNull: false
        },
        phoneNumber: {
            type: STRING,
            allowNull: false
        }
    });

    User.associate = models => {
        const { Project, ProjectParticipator, Task } = models;
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
        //Can be assigned to
        User.hasMany(Task, {
            as: 'assignedTask',
            foreignKey: {
                name: 'assigneeId',
                references: {
                    model: User,
                    key: 'id'
                }
            }
        });
    };

    return User;
};
