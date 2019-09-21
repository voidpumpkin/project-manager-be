'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const { DATE, STRING, INTEGER } = Sequelize;
        await queryInterface.createTable('tasks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: INTEGER
            },
            title: {
                allowNull: false,
                type: STRING
            },
            details: STRING,
            createdAt: {
                allowNull: false,
                type: DATE
            },
            updatedAt: {
                allowNull: false,
                type: DATE
            },
            projectId: {
                allowNull: false,
                type: INTEGER,
                references: {
                    model: 'projects',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            taskId: {
                type: INTEGER,
                references: {
                    model: 'tasks',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('tasks');
    }
};
