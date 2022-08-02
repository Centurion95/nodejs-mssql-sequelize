const { Sequelize, DataTypes } = require('sequelize')
const PaisModel = require('./models/pais')
const EstadoModel = require('./models/estado')
const tedious = require('tedious')

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PWD,
    {
        host: process.env.SERVER,
        dialect: 'mssql', /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
        logging: false, // Disables logging
    })

const options = {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
    // timeZone: 'America/Los_Angeles'
};

const getDate = () => {
    return new Intl.DateTimeFormat('es-ES', options).format(new Date())
}

const main = async () => {
    try {
        console.log(getDate(), ' >>> Iniciando el proceso')

        await ensureDbExists() // create db if it doesn't already exist
        console.log(getDate(), ' >>> ensureDbExists(): finished')

        await sequelize.authenticate()
        console.log(getDate(), ' >>> Connection has been established successfully.')

        const Pais = PaisModel(sequelize, DataTypes)
        const Estado = EstadoModel(sequelize, DataTypes)

        await sequelize.sync(
            // { alter: true }
        )
            .then(() => {
                console.log(getDate(), ' >>> All models were synchronized successfully.')
            })

        //en este proyecto de prueba -> con esto borramos todos los registros...
        await Pais.truncate({})
        await Estado.truncate({})

        //vamos a insertar algunos registros..
        const registro1 = await Pais.create({ nombre: 'Paraguay' })
        const registro2 = await Pais.create({ nombre: 'Argentina' })
        const registro3 = await Pais.create({ nombre: 'Brasil' })
        //select * from [db-test].dbo.pais

        //hacemos select de toda la tabla..
        console.log('registros', await Pais.findAll())
        //https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#specifying-attributes-for-select-queries

        //para hacer select de 1 solo documento..
        const getRegistroById = await Pais.findAll({ where: { id: 1 } })
        console.log('getRegistroById', getRegistroById)


        // para eliminar, por ejemplo el segundo registro:
        await Pais.destroy({ where: { id: 2 } });
        console.log('registros', await Pais.findAll()) //verificamos la eliminacion..

        //y para hacer update de un registro..
        await Pais.update({ nombre: "ACTUALIZADO" }, { where: { id: 3 } });
        console.log('registros', await Pais.findAll()) //verificamos la modificacion..




        //hacemos insert de los siguientes registros, que tienen FK a la tabla anterior..
        await Estado.create({ nombre: 'Alto Paraguay', id_pais: registro1.id })
        await Estado.create({ nombre: 'Alto Paraná', id_pais: registro1.id })
        await Estado.create({ nombre: 'Amambay', id_pais: registro1.id })

        await Estado.create({ nombre: 'Mato Grosso', id_pais: registro3.id })
        await Estado.create({ nombre: 'Minas Gerais', id_pais: registro3.id })

        //hacemos select de toda la coleccion..
        console.log('registros2', await Estado.findAll())

        //--->luego sería el mismo mecanismo para:
        //para hacer select de 1 solo documento..
        //para eliminar, por ejemplo el segundo registro:
        //y para hacer update de un registro..


        sequelize.close()
        // Once sequelize.close() has been called, it's impossible to open a new connection. 
        // You will need to create a new Sequelize instance to access your database again.


        console.log(getDate(), ' >>> Finalizó el proceso')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

async function ensureDbExists() {
    return new Promise((resolve, reject) => {
        const connection = new tedious.Connection({
            "server": process.env.SERVER,
            "options": {
                "port": 1433,
                "trustServerCertificate": true
            },
            "authentication": {
                "type": "default",
                "options": {
                    "userName": process.env.SA_USER,
                    "password": process.env.SA_PWD
                }
            }
        })

        connection.connect((err) => {
            if (err) {
                console.error(err)
                reject(`Connection Failed: ${err.message}`)
            }

            //rc95 31/07/2022 00:30 - solo para nuestro proyecto de ejemplo, voy a borrar la BD al inicio..
            const myQuery = `IF NOT EXISTS (SELECT 1 FROM master.sys.databases WHERE name = '${process.env.DB_NAME}') CREATE DATABASE [${process.env.DB_NAME}];`

            console.log(myQuery)
            const request = new tedious.Request(myQuery, (err) => {
                if (err) {
                    console.error(err)
                    reject(`Create DB Query Failed: ${err.message}`)
                }
                resolve()
            })
            connection.execSql(request)
        })
    })
}


main()
