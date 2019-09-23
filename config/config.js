module.exports = {
    development: {
        dialect: 'sqlite',
        storage: './project_manager_db.db',
        logging: process.env.LOG_SQL === 'true'
    },
    test: {
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
    }
    //TODO: production: {}
};
