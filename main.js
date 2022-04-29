//-------------importes------------
const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session')
const path = require('path');
const { parse } = require('path');
const cloudinary = require('cloudinary').v2



//------------Configs--------------
const app = express();

require('dotenv').config()

cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret
});


app.use(session({
  secret: 'dawdwadawdwa',
  resave: false,
  saveUninitialized: true,
}))

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(express.static('views'));
app.use(express.static('public'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');



//-------------Banco de dados--------------
const Sequelize = require('sequelize');
const { where } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    ssl: true,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // very important
        }

    }
});
sequelize
  .authenticate()
  .then(() => {
    console.log('Coneccao com o banco de dados estabelecidad com sucesso.');
  })
  .catch(err => {
    console.error('erro na coneccao com o banco de dados:', err);
  });


const cadastros = sequelize.define('cadastros', {
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
    // nome_usuario:{
    //     type: Sequelize.STRING,
    //     require: true
    // },
    // data_aniversario:{
    //     type: Sequelize.DATE,
    //     require: true
    // },
    // genero:{
    //     type: Sequelize.STRING,
    //     require: true
    // },
    // premium:{
    //     type: Sequelize.BOOLEAN,
    //     require: true
    // }
});

//cria a tabela caso ela nao exista
const init = async ()=>{
    await cadastros.sync();
}
init()

//------------------POST-----------------


app.post('/alth',(req,res)=>{
    let login = req.body.email
    let senha2 = req.body.password
    cadastros.findOne({
        where:{
            email: req.body.email,
            senha: req.body.password
        }
    }).then((result)=>{
        if (result) {           
            if (login == result.email && senha2 == result.senha) {
                req.session.login = login
                res.redirect('/inicio')
            }
        }else{
            res.redirect("/login?senha=false")
        }
    })
})

app.post('/althCadastro',(req,res)=>{

    cadastros.findOne({
        where:{
            email: req.body.login
        }
    }).then((cadastrado)=>{
        if (cadastrado) {
            res.redirect('/cadastro?cadastrado=false')
        }else{
            cadastros.create({
                email: req.body.login,
                senha: req.body.password
            }).then(function(){
                console.log('cadastrado');
                res.redirect('/login')
            }).catch(function(erro){
                console.log('erro:'+ erro);
            })
        }
    }).catch((err)=>{
        console.log('erro:'+ err);
    })
})


app.post('/addMusica',(req,res)=>{
    //corrigir isso para pegar oque o cliente selecionar
    let nomeMusica = req.body.nomeMusica
    let nomeBanda = req.body.nomeBanda
    let poster = req.body.poster
    let audio = req.body.audio
    cloudinary.uploader.upload(poster,
        { public_id: nomeMusica }, 
    function(error, result) {console.log(result); if(error)console.log(error); });

    res.redirect('/login')
})

//-----------------GET--------------------
app.get("/",(req,res)=>{
    res.render("index")
})

app.get('/login',(req,res)=>{
    if (req.session.login) {
        res.redirect('/inicio')
    }else{
        if (req.query.senha == "false") {
            
            res.render("login",{mensage:"Senha ou email incorretos"})
        }else{
            res.render("login",{mensage:null})
        }
    }
    
})
app.get('/cadastro',(req,res)=>{
    if (req.session.login) {
        res.redirect('/inicio')
    }else{
        if (req.query.cadastrado == "false") {
            res.render('cadastro',{mensage: "O email ja foi cadastrado"})
        }else{
            res.render('cadastro',{mensage:null})
        }
    }
    

})
app.get('/administrador',(req,res)=>{
    res.render('administrador')

})



app.get('/inicio',(req,res)=>{
    if (req.session.login) {
        res.render('inicio')
    }

})













const port = parseInt(process.env.PORT) || 80
app.listen(port,()=>{
    console.log(`Servidor rodando na porta ${port}`);
});