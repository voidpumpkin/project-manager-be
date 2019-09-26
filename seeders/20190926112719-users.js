'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            'users',
            [
                {
                    username: 'test',
                    password: 'test',
                    isSystemAdmin: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    username: 'admin',
                    password: 'voidpumpkin',
                    isSystemAdmin: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    username: 'bob',
                    password: 'jones',
                    isSystemAdmin: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('users', null, {});
    }
};
