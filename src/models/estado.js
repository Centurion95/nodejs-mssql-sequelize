module.exports = (sequelize, DataTypes) => {
    //https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
    return sequelize.define('[estado]', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_pais: {
            type: DataTypes.INTEGER,
            type: DataTypes.INTEGER,
            // model: 'Pais',
            // key: 'id'
        },

    }, {
        // timestamps: false, //por defecto es TRUE..
        
        // disable the modification of tablenames; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,
    })
};
