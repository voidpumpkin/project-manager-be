'use strict';

module.exports = {
    up: async queryInterface => {
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
                },
                {
                    title: 'Test is not allowed',
                    details: 'blah',
                    managerId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ],
            {}
        );
    },

    down: async queryInterface => {
        await queryInterface.bulkDelete('projects', null, {});
    }
};
