const dbConfig = require("../db.config");
const Sequelize = require("sequelize");

// Configuration of the database
const sequelize = new Sequelize(dbConfig.DB,dbConfig.USER,dbConfig.PASSWORD,{
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
    logging: false
});

const db = {};

// Get all models
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("./user.model.js")(sequelize,Sequelize);
db.tokens = require("./token.model.js")(sequelize,Sequelize);
db.notes = require("./note.model.js")(sequelize,Sequelize);

module.exports = db;