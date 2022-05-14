module.exports = (sequelize, Sequelize) => {
    const Tokens = sequelize.define("Tokens", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        accessToken: {
            type: Sequelize.STRING(500)
        },
        refreshToken: {
            type: Sequelize.STRING(500)
        },
        expiresAt: {
            type: Sequelize.BIGINT
        }
    });
    return Tokens;
};