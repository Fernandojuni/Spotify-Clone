var audioplayer = document.getElementById('audioplayer')

var volumeMaximo = document.getElementById('volume-maximo')
var volumeMutado = document.getElementById('volume-mutado')
var volumeBaixo = document.getElementById('volume-baixo')

var playbtn = document.getElementById('playbtn')
var pausebtn = document.getElementById('pausebtn')

var range = document.getElementById('volume')



//index da musica atual
var songIndex = 0



//clicks
var clicks = 0
var clicks2 = 0
var contadorDeMusica = -1
var clicksADDplaylis = 0
var clicksADDmusica = 0;
var clicksCriarPlay = 0
var contadorPlaylist = 0



var playerArtistComponent = document.getElementsByClassName('player-artist')

var popup_criar_play = document.getElementById('popup_criar_play')

var ADDplaylist = document.getElementById('ADDplaylist')

var nomePlay = document.getElementById('nomePlay')


//abertura e fechamento de popups
function criarPlay(){
    clicksCriarPlay++
    if (clicksCriarPlay == 0) {
        popup_criar_play.style.display = 'none'
    }
    if (clicksCriarPlay == 1) {
        popup_criar_play.style.display = 'inline'
    }
    if (clicksCriarPlay == 2) {
        popup_criar_play.style.display = 'none'
    }
    if (clicksCriarPlay == 2) {
        clicksCriarPlay = 0
    }
}

function adicionarMusica(){
    clicksADDmusica++
    if (clicksADDmusica == 0) {
        popup_add_musica.style.display = 'none'
    }
    if (clicksADDmusica == 1) {
        popup_add_musica.style.display = 'inline'
    }
    if (clicksADDmusica == 2) {
        popup_add_musica.style.display = 'none'
    }
    if (clicksADDmusica == 2) {
        clicksADDmusica = 0
    }
}

function ADDplaylis(){
    clicksADDplaylis++
    if (clicksADDplaylis == 0) {
        popupAddPlaylist .style.display = 'none'
    }
    if (clicksADDplaylis == 1) {
        popupAddPlaylist .style.display = 'inline'
    }
    if (clicksADDplaylis  == 2) {
        popupAddPlaylist .style.display = 'none'
    }
    if (clicksADDplaylis  == 2) {
        clicksADDplaylis  = 0
    }
}


//-------------Controle de musica----------
//iniciar musica
document.querySelectorAll('.main-col').forEach(item =>{
    item.addEventListener('click', event=>{
        let id = item.getAttribute('data-id')
        songIndex = id
        iniciarMusica()
    })
})

function zerarplayer(){
    playerArtistComponent[0].innerHTML = ""
    audioplayer.src = ""
    progress2.style.width = 0
    tempo_total.innerHTML = "00:00"
}

function voltar() {
    songIndex--
    iniciarMusica()
}

function avancar() {
    songIndex++
    iniciarMusica()
}

function loopAtv() {
    clicks++
    if (clicks2 == 2 || clicks2 == 0) {
        console.log(clicks);
        if (clicks == 1) {
        document.getElementById('loop').style.color = "#00ff37"
        audioplayer.loop = true
        }
        if (clicks == 2) {
        document.getElementById('loop').style.color = "rgb(180, 179, 179)"
        audioplayer.loop = false
        clicks = 0
        }
    }
}

function alearioAtv() {
    clicks2++
    if (clicks == 2 || clicks == 0) {
        console.log(clicks2);
        if (clicks2 == 1) {
            document.getElementById('aleario').style.color = "#00ff37"
        }
        if (clicks2 == 2) {
            document.getElementById('aleario').style.color = "rgb(180, 179, 179)"
            clicks2 = 0
        }
    }
}

//funcao de iniciar musica
function iniciarMusica(){
    audioplayer.src = 'audio/'+ songList[songIndex].audio
    playerArtistComponent[0].innerHTML = `<img src="img/`+songList[songIndex].imagem+`" /> <h3>`+songList[songIndex].banda+`<br/><span>`+songList[songIndex].nome+`</span></h3>`
        
    if (songIndex > songList.length) {
        songIndex = 0
    }
    audioplayer.play()
    audioplayer.onloadeddata = function() {
        var data = new Date(null);
        data.setSeconds(audioplayer.duration);
        var duracao = data.toISOString().substr(14, 5);
        tempo_total.innerHTML = duracao
    };
    playbtn.style.display = "none"
    pausebtn.style.display = "inline"
}

//pausar e dar play
pausebtn.addEventListener('click', (e)=>{
    e.preventDefault();

    playbtn.style.display = "inline"
    pausebtn.style.display = "none"

    audioplayer.pause()

    return false;
})

playbtn.addEventListener('click', (e)=>{
    e.preventDefault();

    playbtn.style.display = "none"
    pausebtn.style.display = "inline"

    audioplayer.play()

    return false;
})

//volume
document.getElementById("volume").oninput = function() {
    var value = (this.value-this.min)/(this.max-this.min)*100
    this.style.background = 'linear-gradient(to right, #1DB954 0%, #1DB954 ' + value + '%, #fff ' + value + '%, white 100%)'
};

range.addEventListener('input', function() {
    document.getElementById('audioplayer').volume=this.value
    if (this.value == 0) {
        audioplayer.muted = true
        volumeMaximo.style.display = "none"
        volumeMutado.style.display = "inline"
        volumeBaixo.style.display = "none"
        console.log("mutado");
    }else{
        audioplayer.muted = false
        console.log("desmutado");
    }
    if (this.value > 0.5 && this.value <= 1) {
        volumeMaximo.style.display = "inline"
        volumeMutado.style.display = "none"
        volumeBaixo.style.display = "none"
    }

    if (this.value <= 0.5 && this.value > 0 ) {
        volumeMaximo.style.display = "none"
        volumeMutado.style.display = "none"
        volumeBaixo.style.display = "inline"
    }
});

function mutar() {
    audioplayer.muted = true
    volumeMaximo.style.display = "none"
    volumeMutado.style.display = "inline"
    volumeBaixo.style.display = "none"
    console.log("mutado");
}
function desmutar() {
    audioplayer.muted = false
    volumeMaximo.style.display = "inline"
    volumeMutado.style.display = "none"
    volumeBaixo.style.display = "none"
    console.log("desmutado");
}


//barra de progresso do tempo de musica
var progress = document.getElementById('player-control-progress')
var progress2 = document.getElementById('player-control-progress-2')


audioplayer.ontimeupdate = (e) =>{
    progress2.style.width = audioplayer.currentTime*100 / audioplayer.duration + "%";
}

progress.onclick = (e)=>{
    audioplayer.currentTime = ((e.offsetX/progress.offsetWidth) * audioplayer.duration)
}

var audio = document.getElementById('audioplayer')

audio.addEventListener('play', play_evento , false);
audio.addEventListener('timeupdate', atualizar , false);

function play_evento(){
    document.getElementById('tempo_atual').innerHTML = secToStr( audio.currentTime) ;
}

function atualizar(){
    document.getElementById('tempo_atual').innerHTML = secToStr( audio.currentTime);
}

function secToStr( sec_num ) {
    sec_num = Math.floor( sec_num );
    var horas   = Math.floor(sec_num / 3600);
    var minutos = Math.floor((sec_num - (horas * 3600)) / 60);
    var segundos = sec_num - (horas * 3600) - (minutos * 60);

    if (horas   < 10) {horas   = "0"+horas;}
    if (minutos < 10) {minutos = "0"+minutos;}
    if (segundos < 10) {segundos = "0"+segundos;}
    var tempo = minutos+':'+segundos;
    return tempo;
}