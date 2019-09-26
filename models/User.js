module.exports = (sequelize, DataTypes) => {
    const { STRING, BOOLEAN } = DataTypes;
    const User = sequelize.define('user', {
        username: {
            type: STRING,
            allowNull: false
        },
        password: {
            type: STRING,
            allowNull: false
        },
        isSystemAdmin: {
            type: BOOLEAN,
            allowNull: false
        }
    });

    return User;
};
