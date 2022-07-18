const Sequelize = require('sequelize')

const sequelize = require('../db')

const playlists = sequelize.define('playlists',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome_play:{
        type: Sequelize.STRING,
        require:true,
    },
    codigo_play:{
        type: Sequelize.STRING,
        require:true,
    },
    id_usuario:{
        type: Sequelize.INTEGER,
        require:true
    },
    foto_play:{
        type: Sequelize.TEXT
    },
    musicas:{
        type: Sequelize.STRING
    },
    publica:{
        type: Sequelize.BOOLEAN
    }
})

const init = async () =>{
    await playlists.sync()
}

init()

module.exports = playlists