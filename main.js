//-------------importes------------
const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session')
const path = require('path');
const { parse } = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2


//-------------Banco de dados--------------
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    ssl: true,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    },
})


const cadastro = sequelize.define('cadastros', {
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
    }
},{
    timestamps: false
});


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



//------------------POST-----------------

app.post('/alth',(req,res)=>{
    let login = req.body.email
    let senha = req.body.password
    if (login == "adm" && senha == "adm") {
        req.session.login = login
        res.redirect('/inicio')
    }
})

app.post('/althCadastro',(req,res)=>{

    cadastro.findOne({
        where:{
            email: req.body.login
        }
    }).then((cadastrado)=>{
        if (cadastrado) {
            res.redirect('/login')
        }else{
            cadastro.create({
                email: req.body.login,
                senha: req.body.password
            }).then(function(){
                console.log('cadastrado');
                res.redirect('/login')
            }).catch(function(erro){
                console.log('erro'+ erro);
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
        res.render('login')
    }
    
})
app.get('/cadastro',(req,res)=>{
    if (req.session.login) {
        res.redirect('/inicio')
    }else{
        res.render('cadastro')
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