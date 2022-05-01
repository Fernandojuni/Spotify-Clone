const Sequelize = require('sequelize')

const sequelize = require('../db')

const test = sequelize.define('test',{
    image:{
        type: Sequelize.BLOB,
    }

})

const init = async () =>{
    await test.sync()
}

init()

module.exports = test