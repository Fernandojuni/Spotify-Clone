const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');


const port = 80

const app = express();




app.listen(port,()=>{
    console.log(`Servidor ativo na porta ${port}`);
});