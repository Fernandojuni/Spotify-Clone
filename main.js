const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const port = process.env.PORT || 3000

const app = express();
app.use(express.static('views'));
app.use(express.static('public'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');


app.get('/',(req,res)=>{
    res.render('login')
})


app.listen(port,()=>{
    console.log(`Servidor ativo na porta ${port}`);
});