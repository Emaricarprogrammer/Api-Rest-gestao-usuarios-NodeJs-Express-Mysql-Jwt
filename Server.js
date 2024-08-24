const express = require("express")
const app = express()
const mysql = require("mysql")
const bodyParser = require("body-parser")
const routes = require("./Routes/router")
const Cors = require("cors")
require("dotenv").config()

app.use(Cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
/*
app.use((req, res, next) => {
    return res.status(404).json({message: "Houve um erro, por favor tente mais tarde"})

})
*/
/*
app.use((err, req, res, next) => {
    console.log("Houve um erro ao acessar esta rota: ", err)
    return res.status(500).json({message: "Houve um erro ao acessar esta rota, tente mais tarde"})
    next()
})*/
app.use(express.json())
app.use("/api", routes)

const Porta = 5000 || process.env.PORT_URI
app.listen(Porta, function(){
    console.log(`Servidor rodando na porta ${Porta}, do ambiente de ${process.env.ENV}`)
})