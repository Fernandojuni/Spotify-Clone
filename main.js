//-------------importes------------
const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session')
const path = require('path');
const { parse } = require('path');
const cloudinary = require('cloudinary').v2
const multer = require('multer');
const upload = multer();


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
const cadastros = require('./DataBase/models/cadastros')

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
                if (result.email == "adm@gmail.com" && result.senha == "adm") {
                    req.session.adm = login
                    console.log(req.session.id);
                    res.redirect('/inicio')
                }else{
                    req.session.login = login
                    console.log(req.session.id);
                    res.redirect('/inicio')
                }
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
                senha: req.body.password,
                nome_usuario: req.body.nome_usuario,
                data_aniversario_dia:req.body.dia,
                data_aniversario_mes:req.body.mes,
                data_aniversario_ano:req.body.ano,
                genero: undefined,
                premium: false
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


//-----------------GET--------------------
app.get("/",(req,res)=>{
    res.render("index")
})

app.get('/login',(req,res)=>{
    if (req.session.adm) {
        res.redirect('/inicio',{usuario:"adm"})
    }else{
        if (req.session.login) {
            res.redirect('/inicio',{usuario:""})
        }else{
            if (req.query.logado == "false") {
                res.render("login",{mensage:"Faça login para continuar"})
            }else{
                if (req.query.senha == "false") {
                
                    res.render("login",{mensage:"Senha ou email incorretos"})
                }else{
                    res.render("login",{mensage:null})
                }
            }
        }
    }
    
})
app.get('/cadastro',(req,res)=>{
    if (req.session.adm) {
        res.redirect('/inicio',{usuario:"adm"})
    }else{
        if (req.session.login) {
            res.redirect('/inicio',{usuario:""})
        }else{
            if (req.query.cadastrado == "false") {
                res.render('cadastro',{mensage: "O email ja foi cadastrado"})
            }else{
                res.render('cadastro',{mensage:null})
            }
        }
    }

    

})



app.get('/inicio',(req,res)=>{
    if (req.session.adm || req.session.login ) {
        if (req.session.adm) {
            res.render('inicio',{usuario:"adm"})
        }else{
            if (req.session.login) {
                cadastros.findOne({
                    where:{
                        email: req.session.login
                    }
                }).then((result)=>{
                    res.render('inicio',{usuario:result.nome_usuario})
                }).catch((err)=>{
                    console.log('erro:'+ err);
                })
                
            }
        }

    }else{
        res.redirect('/login?logado=false')
    }
})

app.get('/logout',(req,res)=>{
    const sessionID = req.session.id;
    req.sessionStore.destroy(sessionID, (err) => {
    if(err){
        return console.error(err)
    }
    console.log("A session foi destruida!")
    res.redirect("/login")
})
})




//-----------------temp----------
// const test = require('./DataBase/models/test')
// app.get("/test2",(req,res)=>{
//     res.render("test")
// })


// app.post("/testalth", upload.single('image'),(req,res)=>{   
//     console.log(req.file);
//     test.create({
//         image: req.file.buffer
//     })
// })

// test.findAll().then((result)=>{
//     console.log(result);
// })



const port = parseInt(process.env.PORT) || 80
app.listen(port,()=>{
    console.log(`\u001b[32m Servidor rodando na porta ${port}` );
});