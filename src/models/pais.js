module.exports = (sequelize, DataTypes) => {
    //https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
    return sequelize.define('pais', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },

    }, {
        // timestamps: false //por defecto es TRUE..
    })
};
