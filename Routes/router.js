const router = require("express").Router()

const UsuarioRouter = require('./UserRoute/Routes')
router.use("/", UsuarioRouter)

module.exports = router