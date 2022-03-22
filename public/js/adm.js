var output = document.getElementById('output');
var file = document.getElementById('file')

var text = document.getElementById('nome')
var audio = document.getElementById('audio')

function adicionarAdudio(){
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
    output.src = URL.createObjectURL(event.target.files[0]);
};