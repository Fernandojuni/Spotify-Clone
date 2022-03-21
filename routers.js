const express = require("express")
const router = express.Router()
const app = express();
module.exports = (route)=>{
    app.get('/',(req,res)=>{
        res.render('login')
    })


}