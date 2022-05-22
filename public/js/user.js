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