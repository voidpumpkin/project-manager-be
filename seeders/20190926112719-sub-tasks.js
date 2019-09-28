'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            'tasks',
            [
                {
                    title: 'Buy PC',
                    details: 'cheap one',
                    isDone: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    projectId: 1,
                    taskId: 2
                },
                {
                    title: 'Download VS code',
                    details: 'something',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isDone: true,
                    projectId: 1,
                    taskId: 2
                },
                {
                    title: 'Give up',
                    details: '',
                    isDone: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    projectId: 1,
                    taskId: 2
                }
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('tasks', null, {});
    }
};
