module.exports = (sequelize,Sequelize) => {
    const Notes = sequelize.define("Notes",{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING(1500)
        },
        assigneesId: {
            type: Sequelize.STRING
        },
        priority: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.STRING
        },
        dueDate: {
            type: Sequelize.DATE
        }
    });
    return Notes;
};