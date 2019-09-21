module.exports = {
    development: {
        dialect: 'sqlite',
        storage: './project_manager_db.db'
    },
    test: {
        dialect: 'sqlite',
        storage: ':memory:'
    }
    //TODO: production: {}
};
