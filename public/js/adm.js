var output = document.getElementById('output');
var file = document.getElementById('file')

var text = document.getElementById('nome')
var audio = document.getElementById('audio')

var mimetype = document.getElementById('mimetype')
var nomeImg = document.getElementById('nomeImg')
var nomeAudio = document.getElementById('nomeAudio')

function adicionarAdudio(){
    nomeAudio.value = audio.files[0].name
    var nome = "Não há arquivo selecionado.";
    if(audio.files.length > 0) nome = audio.files[0].name;
    text.innerHTML = nome;
}

function selecionarAudio(){
    audio.click()
}


function selecionar(){
    file.click()
}
var loadFile = function(event) {
    mimetype.value = event.target.files[0].type
    nomeImg.value = event.target.files[0].name
    output.src = URL.createObjectURL(event.target.files[0]);
};