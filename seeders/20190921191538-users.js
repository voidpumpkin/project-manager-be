'use strict';

module.exports = {
    up: async queryInterface => {
        await queryInterface.bulkInsert(
            'users',
            [
                {
                    username: 'test',
                    password: '$2b$08$ViFipzm2fiu0YS5beDKyROtVgVnlfKo71cqByoBAraz5Djzt0BsRK', //test
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    firstName: 'uncle',
                    lastName: 'bob',
                    email: 'uncle@bob.com',
                    phoneNumber: '6664666'
                },
                {
                    username: 'admin',
                    password: '$2b$08$HMgLqPMffOj2yZY4qo80eOd0vWhidp8370UzoVPProuom9hRYviwG', //voidpumpkin
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    firstName: 'uncle',
                    lastName: 'bob',
                    email: 'uncle@bob.com',
                    phoneNumber: '6664666'
                },
                {
                    username: 'bob',
                    password: '$2b$08$HMgLqPMffOj2yZY4qo80eOQc9mfQJgtu9OI0jvtGhCNXx.GPd3sfi', //jones
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    firstName: 'uncle',
                    lastName: 'bob',
                    email: 'uncle@bob.com',
                    phoneNumber: '6664666'
                }
            ],
            {}
        );
    },

    down: async queryInterface => {
        await queryInterface.bulkDelete('users', null, {});
    }
};
