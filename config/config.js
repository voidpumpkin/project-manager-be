module.exports = {
    development: {
        dialect: 'sqlite',
        storage: './project_manager_db.db',
        logging: true
    },
    test: {
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
    }
    //TODO: production: {}
};
