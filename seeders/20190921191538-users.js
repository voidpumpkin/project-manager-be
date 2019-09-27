'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            'users',
            [
                {
                    username: 'test',
                    password: '$2b$08$HMgLqPMffOj2yZY4qo80eOPkgViVZ6Ri1bESw03ufHLPY4sMurL/W', //test
                    isSystemAdmin: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    username: 'admin',
                    password: '$2b$08$HMgLqPMffOj2yZY4qo80eOd0vWhidp8370UzoVPProuom9hRYviwG', //voidpumpkin
                    isSystemAdmin: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    username: 'bob',
                    password: '$2b$08$HMgLqPMffOj2yZY4qo80eOQc9mfQJgtu9OI0jvtGhCNXx.GPd3sfi', //jones
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
