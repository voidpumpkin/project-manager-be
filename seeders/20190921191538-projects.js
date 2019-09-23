'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            'projects',
            [
                {
                    title: 'APEX Legends',
                    details: 'game!',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    title: 'Jenkins',
                    details: '',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    title: 'Travis',
                    details: 'Ugly cousin',
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
