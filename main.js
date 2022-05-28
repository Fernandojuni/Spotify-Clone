//-------------importes------------
const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session')
const path = require('path');
var Router = require('router')
const multer = require('multer')

//------------Configs--------------
const app = express();
const router = Router()



require('dotenv').config()


app.use(session({
  secret: 'dawdwadawdwa',
  resave: false,
  saveUninitialized: true,
}))


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(express.static('views'));
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname +'/uploads/')
    },
    filename: function (req, file, cb) {
        const novoNomeArquivo = file.originalname

        //---------------------------
        //caso queira encripitar o nome usa essa funcao: 
        //const novoNomeArquivo = require('crypto')
        //.randomBytes(64)
        //.toString('hex');
        //---------------------------
        
        // Indica o novo nome do arquivo:
        cb(null, `${novoNomeArquivo}`)
    }
});

const upload = multer({ storage });





//-------------Banco de dados--------------


const cadastros = require('./DataBase/models/cadastros')
const musicas = require('./DataBase/models/musicas')


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
                if (result.ADM == true) {
                    req.session.adm = login
                    res.redirect('/inicio')
                }else{
                    req.session.login = login
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
                foto_perfil: null,
                data_aniversario_dia:req.body.dia,
                data_aniversario_mes:req.body.mes,
                data_aniversario_ano:req.body.ano,
                genero: undefined,
                premium: false,
                ADM: true
            }).then(function(){
                res.redirect('/login')
            }).catch(function(erro){
                console.log('erro:'+ erro);
            })
        }
    }).catch((err)=>{
        console.log('erro:'+ err);
    })
})

app.post('/foto/:nome', upload.single('file'), (req,res)=>{
    var imageBase64 = fs.readFileSync(__dirname + "/uploads/"+ req.body.output, 'base64');
    fs.unlink(__dirname + "/uploads/"+ req.body.output, function (err){
        if (err) throw err;
        console.log('Arquivo deletado!');
    })
    var imgSrc = "data:" + req.body.mimetype +";base64," + imageBase64
    cadastros.update({foto_perfil: imgSrc},{where:{nome_usuario: req.params.nome}})
    
    res.redirect('/user/'+ req.params.nome)
})


app.post('/addMusica', upload.fields([{name: 'audio', maxCount: 1},{name: 'poster', maxCount: 1}]),(req,res)=>{
    // fs.copyFileSync('C:/xmlpath/file.xml', 'C:/test/file.xml');
    musicas.create({
        nomeMusica: req.body.nomeMusica,
        nomeBanda:req.body.nomeBanda,
        tags: null,
        posterPath: '../uploads/'+ req.body.nomeimg,
        audioPath: '../uploads/'+ req.body.nomeAudio,
    }).then(function(){
        
        res.redirect('/ADM')
    }).catch(function(erro){
        console.log('erro:'+ erro);
    })
})
musicas.findAll().then((ee)=>{console.log(ee);})
//-----------------GET--------------------
app.get("/",(req,res)=>{
    res.render("index")
})

app.get('/login',(req,res)=>{
    if (req.session.adm) {
        res.redirect('/inicio')
    }else{
        if (req.session.login) {
            res.redirect('/inicio')
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
        res.redirect('/inicio')
    }else{
        if (req.session.login) {
            res.redirect('/inicio')
        }else{
            if (req.query.cadastrado == "false") {
                res.render('cadastro',{mensage: "O email ja foi cadastrado"})
            }else{
                res.render('cadastro',{mensage:null})
            }
        }
    }
})


//
app.get('/inicio',(req,res)=>{
    if (req.session.adm || req.session.login ) {
        musicas.findAll().then((musica)=>{
            if (req.session.adm) {
                cadastros.findOne({
                    where:{
                        email: req.session.adm
                    }
                }).then((result)=>{ 
                    res.render('inicio',{result:result, musica:musica})
                }).catch((err)=>{
                    console.log('erro:'+ err);
                })
            }else{
                cadastros.findOne({
                    where:{
                        email: req.session.login
                    }
                }).then((result)=>{
                    res.render('inicio',{result:result,musica:musica}) 
                }).catch((err)=>{
                    console.log('erro:'+ err);
                })
            }
        }).catch(function(erro){
            console.log('erro:'+ erro);
        })
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
    res.redirect("/login")
})
})

app.get('/user/:nome' ,(req,res)=>{
    if (req.session.adm || req.session.login ) {
        cadastros.findOne({
            where:{
                nome_usuario: req.params.nome
            }
        }).then((result)=>{
            if (result) {
                res.render('user',{usuario:result})
            }else{
                res.redirect('/inicio')
            }
        }).catch((err)=>{
            console.log('erro:'+ err);
        })
    }else{
        res.redirect('/login?logado=false')
    }
})


app.get('/ADM',(req,res)=>{
    if (req.session.adm) {
        res.render('administrador')
    }else{
        res.redirect('/inicio')
    }
})








//-------------temp---------------

















const port = process.env.PORT || 80
app.listen(port,()=>{
    console.log(`Servidor rodando na porta ${port}` );
});