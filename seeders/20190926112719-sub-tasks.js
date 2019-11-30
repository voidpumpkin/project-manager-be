'use strict';

module.exports = {
    up: async queryInterface => {
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
                    taskId: 2,
                    assigneeId: 1
                },
                {
                    title: 'Download VS code',
                    details: 'something',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isDone: true,
                    projectId: 1,
                    taskId: 2,
                    assigneeId: 1
                },
                {
                    title: 'Give up',
                    details: '',
                    isDone: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    projectId: 1,
                    taskId: 2,
                    assigneeId: 1
                }
            ],
            {}
        );
    },

    down: async queryInterface => {
        await queryInterface.bulkDelete('tasks', null, {});
    }
};
