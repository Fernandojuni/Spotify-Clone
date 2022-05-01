const Sequelize = require('sequelize')

const sequelize = require('../db')

const playlists = sequelize.define('playlists',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_usuario:{
        type: Sequelize.INTEGER,
        references: {
            model: 'cadastros',
            key: 'id'
        }
    },
    musicas:{
        type: Sequelize.JSON
    }
})

const init = async () =>{
    await playlists.sync()
}

init()

module.exports = playlists