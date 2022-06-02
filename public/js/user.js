var entrar = document.getElementById('entrar')
var output = document.getElementById('output')
var file = document.getElementById('file')
var mimetype = document.getElementById('mimetype')

function select() {
    file.click()
}
var loadFile = function(event) {
    output.value = event.target.files[0].name
    mimetype.value = event.target.files[0].type

    entrar.click()
};

var abrirPerfil = 0
var popup_perfil = document.getElementById("popup-perfil")
function abrirPopupPerfil(){
    abrirPerfil++
    if (abrirPerfil == 0) {
        popup_perfil.style.display = 'none'
    }
    if (abrirPerfil == 1) {
        popup_perfil.style.display = 'inline'
    }
    if (abrirPerfil == 2) {
        popup_perfil.style.display = 'none'
    }
    if (abrirPerfil == 2) {
        abrirPerfil = 0
    }
}