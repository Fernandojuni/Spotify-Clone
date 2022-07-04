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
        const nomeArquivo = file.originalname
        
        // Indica o novo nome do arquivo:
        cb(null, `${nomeArquivo}`)
    }
});

const upload = multer({ storage });





//-------------Banco de dados--------------


const cadastros = require('./DataBase/models/cadastros')
const musicas = require('./DataBase/models/musicas')
const playlists = require('./DataBase/models/playlists')

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
            const codigo = require('crypto').randomBytes(22).toString('hex') + "-User";
            cadastros.create({
                email: req.body.login,
                senha: req.body.password,
                codigo_user: codigo,
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

app.post('/foto/:codigo', upload.single('file'), (req,res)=>{
    var imageBase64 = fs.readFileSync(__dirname + "/uploads/"+ req.body.output, 'base64');
    fs.unlink(__dirname + "/uploads/"+ req.body.output, function (err){
        if (err) throw err;
    })
    var imgSrc = "data:" + req.body.mimetype +";base64," + imageBase64
    cadastros.update({foto_perfil: imgSrc},{where:{codigo_user: req.params.codigo}})
    
    res.redirect('/user/'+ req.params.codigo)
})

app.post('/addMusica', upload.fields([{name: 'audio', maxCount: 1},{name: 'poster', maxCount: 1}]),(req,res)=>{
    const codigoImg = require('crypto').randomBytes(64).toString('hex') + "-Musica_IMG";
    const extensaoImg = "." + req.body.nomeimg.split('.')[1];
    const nomeImgCode = codigoImg + extensaoImg


    const codigoAudio = require('crypto').randomBytes(64).toString('hex') + "-Musica_Audio";
    const extensaoAudio = "." + req.body.nomeAudio.split('.')[1];
    const nomeAudioCode = codigoAudio + extensaoAudio

    fs.copyFileSync(__dirname + '/uploads/' + req.body.nomeimg, __dirname + '/public/musicas/img/' + nomeImgCode);
    fs.copyFileSync(__dirname + '/uploads/' + req.body.nomeAudio, __dirname + '/public/musicas/audio/' + nomeAudioCode);

    fs.unlink(__dirname + "/uploads/"+ req.body.nomeimg, function (err){
        if (err) throw err;
    })
    fs.unlink(__dirname + "/uploads/"+ req.body.nomeAudio, function (err){
        if (err) throw err;
    })
    musicas.create({
        nomeMusica: req.body.nomeMusica,
        nomeBanda:req.body.nomeBanda,
        tags: null,
        posterPath: '../public/musicas/img/'+ nomeImgCode,
        audioPath: '../public/musicas/audio/'+ nomeAudioCode,
    }).then(function(){
        res.redirect('/ADM')
    }).catch(function(erro){
        console.log('erro:'+ erro);
    })
})

app.post('/criarPlay',(req,res)=>{
    const codigo = require('crypto').randomBytes(22).toString('hex') + "-Playlist";

    if (req.session.adm) {
        cadastros.findOne({where:{email:req.session.adm}}).then((result)=>{
            playlists.create({
                nome_play: req.body.playlistName,
                codigo_play: codigo,
                id_usuario: result.id,
                musicas:null,
                publica: true,
                foto_play:null
            })
        })
        res.redirect('/inicio')
    }else{
        cadastros.findOne({where:{email:req.session.login}}).then((result)=>{
            playlists.create({
                nome_play: req.body.playlistName,
                codigo_play: codigo,
                id_usuario: result.id,
                musicas: null
            })
        })
        res.redirect('/inicio')
    }
})

app.post("/playlist/:codigo",upload.single('file'),(req,res)=>{
    var imageBase64 = fs.readFileSync(__dirname + "/uploads/"+ req.body.output, 'base64');
    fs.unlink(__dirname + "/uploads/"+ req.body.output, function (err){
        if (err) throw err;
    })
    var imgSrc = "data:" + req.body.mimetype +";base64," + imageBase64

    playlists.update({foto_play: imgSrc},{where:{codigo_play: req.params.codigo}})

    res.redirect('/playlist/'+ req.params.codigo)
})

app.post('/AddPlay',(req,res)=>{
    let musicaAtual = req.body.musicaAtual
    playlists.findOne({
        where:{
            codigo_play: req.body.playlist
        }
    }).then((result)=>{
        let musicasPlay = ""
        if (result.musicas == null || result.musicas == "null") {
            musicasPlay = musicaAtual
        }else{
            musicasPlay = result.musicas + "," + musicaAtual
        }
        
        playlists.update({musicas:musicasPlay},{where:{codigo_play: req.body.playlist}})
        res.redirect("/inicio")
    })
})

app.post("/editPlay/:codigo",(req,res)=>{
    playlists.update({nome_play:req.body.nome_play},{where:{codigo_play: req.params.codigo}})
    res.redirect("/playlist/"+req.params.codigo)
})

app.post("/editUser/:codigo",(req,res)=>{
    cadastros.update({nome_usuario:req.body.nome_play},{where:{codigo_user: req.params.codigo}})
    res.redirect("/user/"+req.params.codigo)
})

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
                    playlists.findAll({where:{id_usuario:result.id}}).then((playlist)=>{
                        res.render('inicio',{result:result, musica:musica, playlist:playlist})
                    })
                }).catch((err)=>{
                    console.log('erro:'+ err);
                })
                
                
            }else{
                cadastros.findOne({
                    where:{
                        email: req.session.login
                    }
                }).then((result)=>{
                    playlists.findAll({where:{id:result.id}}).then((playlist)=>{
                        res.render('inicio',{result:result, musica:musica, playlist:playlist})
                    }) 
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

app.get('/user/:codigo' ,(req,res)=>{
    if (req.session.adm || req.session.login ) {
        cadastros.findOne({
            where:{
                codigo_user: req.params.codigo
            }
        }).then((result)=>{
            if (result) {
                if (result.email == req.session.login || result.email == req.session.adm) {
                    playlists.findAll({where:{id_usuario:result.id}}).then((playlist)=>{
                        res.render('user',{usuario:result, userAtual:result,playlist:playlist})
                    })
                    
                }else{
                    if (req.session.adm) {
                        cadastros.findOne({
                            where:{
                                email:req.session.adm
                        }}).then((userAtual)=>{
                            playlists.findAll({where:{id_usuario:userAtual.id}}).then((playlist)=>{
                                res.render('Visualizar_User',{usuario:result, userAtual:userAtual,playlist:playlist})
                            })
                           
                        })
                    }else{
                        cadastros.findOne({
                            where:{
                                email:req.session.login
                        }}).then((userAtual)=>{
                            playlists.findAll({where:{id_usuario:userAtual.id}}).then((playlist)=>{
                                res.render('Visualizar_User',{usuario:result, userAtual:userAtual, playlist:playlist})
                            })
                        })
                    }
                }
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


app.get("/playlist/:codigo",(req,res)=>{
    if (req.session.adm || req.session.login ) {
        if (req.session.adm) {
            cadastros.findOne({
                where:{
                    email:req.session.adm
            }}).then((usuario)=>{
                playlists.findOne({where:{codigo_play: req.params.codigo}}).then((result)=>{
                    playlists.findAll({where:{id_usuario:usuario.id}}).then((playlist)=>{
                        let musicaPlay = result.musicas
                        musicas.findAll().then((musica)=>{
                            res.render('playlist',{usuario,result,playlist,musicaPlay,musica})
                        })
                    })
                })
            })
        }else{
            cadastros.findOne({
                where:{
                    email:req.session.login
            }}).then((usuario)=>{
                playlists.findOne({where:{codigo_play: req.params.codigo}}).then((result)=>{
                    playlists.findAll({where:{id_usuario:usuario.id}}).then((playlist)=>{
                        let musicaPlay = result.musicas
                        musicas.findAll().then((musica)=>{
                            res.render('playlist',{usuario,result,playlist,musicaPlay,musica})
                        })
                    })
                })
            })
        }
    }else{
        res.redirect('/login?logado=false')
    }
})







//-------------temp---------------

















const port = process.env.PORT || 80
app.listen(port,()=>{
    console.log(`Servidor rodando na porta ${port}` );
});