const express = require('express')
const app = express()

var bodyParser = require('body-parser')
app.use(bodyParser.json())

const dotenv = require('dotenv')
dotenv.config()

const routes = require("./routes")

require("./utils/db")

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.sendStatus(400)
    }
    next()
})

const port = process.env.PORT
app.use(routes)
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`))