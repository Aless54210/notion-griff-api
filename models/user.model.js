module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("Users", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        tokensId: {
            type: Sequelize.INTEGER
        }
    });
    return Users;
};