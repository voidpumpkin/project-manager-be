'use strict';

module.exports = {
    up: async queryInterface => {
        await queryInterface.bulkInsert(
            'tasks',
            [
                {
                    title: 'Create character',
                    details: 'just copy from internet',
                    isDone: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    projectId: 1,
                    assigneeId: 1
                },
                {
                    title: 'Code something',
                    details: 'something',
                    isDone: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    projectId: 1,
                    assigneeId: 1
                },
                {
                    title: 'Create epic map',
                    details: 'no rly, steal from Epic',
                    isDone: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    projectId: 1,
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
