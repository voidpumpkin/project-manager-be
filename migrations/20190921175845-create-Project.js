'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const { DATE, STRING, INTEGER } = Sequelize;
        await queryInterface.createTable('projects', {
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
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('projects');
    }
};
