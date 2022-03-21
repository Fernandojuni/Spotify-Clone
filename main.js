const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session')
const path = require('path');
const { parse } = require('path');

const routers = require('./routers.js')

const app = express();

app.use(express.static('views'));
app.use(express.static('public'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');


app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/cadastro',(req,res)=>{
    res.render('cadastro')
})

const port = parseInt(process.env.PORT) || 3000
app.listen(port,()=>{
    console.log(`Servidor ativo na porta ${port}`);
});