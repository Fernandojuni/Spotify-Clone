const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session')
const path = require('path');
const { parse } = require('path');
var cloudinary = require('cloudinary').v2

require('dotenv').config()

const app = express();

cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret
});

app.use(express.static('views'));
app.use(express.static('public'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');



//------------------POST-----------------

app.post('/addMusica',(req,res)=>{
    //corrigir isso para pegar oque o cliente selecionar
    let nomeMusica = req.body.nomeMusica
    let nomeBanda = req.body.nomeBanda
    cloudinary.uploader.upload("public/img/imagem-vazia.jpg",
        { public_id: "imagem-vazia" }, 
    function(error, result) {console.log(result); if(error)console.log(error); });
    res.redirect('/login')
})

//-----------------GET--------------------
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/cadastro',(req,res)=>{
    res.render('cadastro')

})
app.get('/administrador',(req,res)=>{
    res.render('administrador')

})

const port = parseInt(process.env.PORT) || 3000
app.listen(port,()=>{
    console.log(`Servidor ativo na porta ${port}`);
});