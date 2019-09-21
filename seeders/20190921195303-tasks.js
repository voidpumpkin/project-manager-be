'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            'tasks',
            [
                {
                    title: 'Create character',
                    details: 'just copy from internet',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    projectId: 1
                },
                {
                    title: 'Code something',
                    details: 'something',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    projectId: 1
                },
                {
                    title: 'Create epic map',
                    details: 'no rly, steal from Epic',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    projectId: 1
                }
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('tasks', null, {});
    }
};
