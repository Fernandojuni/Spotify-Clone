const { Sequelize } = require("sequelize")

const sequelize = new Sequelize(process.env.DATABASE_URL,{
    dialectOptions:{
        ssl:{
            rejectUnauthorized:false,
        },
    }
})



sequelize
    .authenticate()
    .then(()=> console.log('Conexão estabelecida com sucesso!!!'))
    .catch((err)=> console.error("Erro ao se conectar com o banco de dados: ",err))



module.exports = sequelize;