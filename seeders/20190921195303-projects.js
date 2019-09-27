'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            'projects',
            [
                {
                    title: 'APEX Legends',
                    details: 'game!',
                    managerId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    title: 'Jenkins',
                    details: '',
                    managerId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    title: 'Travis',
                    details: 'Ugly cousin',
                    managerId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('projects', null, {});
    }
};
