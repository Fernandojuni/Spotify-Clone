const Sequelize = require('sequelize')

const sequelize = require('../db')

const cadastros = sequelize.define('cadastros',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        require: true
    },
    senha: {
        type: Sequelize.STRING,
        require: true
    },
    nome_usuario:{
        type: Sequelize.STRING,
        require: true
    },
    // foto_perfil:{
    //     type: Sequelize.BLOB,
    // },
    data_aniversario_dia:{
        type: Sequelize.STRING,
        require: true
    },
    data_aniversario_mes:{
        type: Sequelize.STRING,
        require: true
    },
    data_aniversario_ano:{
        type: Sequelize.STRING,
        require: true
    },
    genero:{
        type: Sequelize.STRING,
        require: true
    },
    premium:{
        type: Sequelize.BOOLEAN,
        require: true
    },
    

})

const init = async () =>{
    await cadastros.sync()
}

init()

module.exports = cadastros