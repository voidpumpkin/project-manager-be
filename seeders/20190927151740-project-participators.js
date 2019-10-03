'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            'projectParticipators',
            [
                {
                    projectId: 1,
                    participatorId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    projectId: 2,
                    participatorId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    projectId: 1,
                    participatorId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('tasks', null, {});
    }
};
