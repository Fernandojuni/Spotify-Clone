var audioplayer = document.getElementById('audioplayer')

var volumeMaximo = document.getElementById('volume-maximo')
var volumeMutado = document.getElementById('volume-mutado')
var volumeBaixo = document.getElementById('volume-baixo')

var playbtn = document.getElementById('playbtn')
var pausebtn = document.getElementById('pausebtn')

var range = document.getElementById('volume')

var main = document.getElementById("main")



//clicks
var clicks = 0
var clicks2 = 0
var contadorDeMusica = -1
var clicksADDplaylis = 0
var clicksADDmusica = 0;
var clicksCriarPlay = 0
var contadorPlaylist = 0
var clicksPerfil = 0



var playerArtistComponent = document.getElementsByClassName('player-artist')

var popup_criar_play = document.getElementById('popup_criar_play')



var main_top = document.getElementById('main-top')


var popup_perfil = document.getElementById("popup-perfil")

//controle do scroll e estilos

main.addEventListener('scroll', ()=>{
    if (main.scrollTop > 1) {
        main_top.style.backgroundColor = "black"
        return
    }
    if (main.scrollTop < 1) {
        main_top.style.backgroundColor = "transparent"
    }
})

//abertura e fechamento de popups
var popupAddPlaylist = document.getElementById('popupAddPlaylist')
function ADDplaylis(){
    clicksADDplaylis++
    if (clicksADDplaylis == 0) {
        popupAddPlaylist.style.display = 'none'
    }
    if (clicksADDplaylis == 1) {
        popupAddPlaylist.style.display = 'inline'
    }
    if (clicksADDplaylis == 2) {
        popupAddPlaylist.style.display = 'none'
    }
    if (clicksADDplaylis == 2) {
        clicksADDplaylis = 0
    }
}

function abrirPopupPerfil(){
    clicksCriarPlay++
    if (clicksCriarPlay == 0) {
        popup_perfil.style.display = 'none'
    }
    if (clicksCriarPlay == 1) {
        popup_perfil.style.display = 'inline'
    }
    if (clicksCriarPlay == 2) {
        popup_perfil.style.display = 'none'
    }
    if (clicksCriarPlay == 2) {
        clicksCriarPlay = 0
    }
}

//-------------Controle de musica----------
//iniciar musica


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