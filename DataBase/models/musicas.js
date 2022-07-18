const Sequelize = require('sequelize')

const sequelize = require('../db')

const musicas = sequelize.define('musicas',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nomeMusica:{
        type: Sequelize.STRING,
        require: true
    },
    nomeBanda:{
        type: Sequelize.STRING,
        require: true
    },
    tags:{
        type: Sequelize.JSON,
        require: true
    },
    posterPath:{
        type: Sequelize.STRING,
        require: true
    },
    audioPath:{
        type: Sequelize.STRING,
        require: true
    }
})

const init = async () =>{
    await musicas.sync()
}

init()

module.exports = musicas