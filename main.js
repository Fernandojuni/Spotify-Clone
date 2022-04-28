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

app.set('trust proxy', 1)
app.use(session({
  secret: '21421512512542d2*@&*T!T$*!@@($!132154215452dawdaw',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
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
    res.render('login')
})
app.get('/cadastro',(req,res)=>{
    res.render('cadastro')

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