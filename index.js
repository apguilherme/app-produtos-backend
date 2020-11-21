require('dotenv').config()

const jwt = require('jsonwebtoken');
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const InitMongoServer = require('./config/db') // database connection

const CategoriaProdutoRoute = require('./routes/CategoriaProdutoRoute')
const AuthRoute = require('./routes/AuthRoute')
const UserRoute = require('./routes/UserRoute')
const ProdutoRoute = require('./routes/ProdutoRoute')
const PedidoProdutoRoute = require('./routes/PedidoProdutoRoute')

InitMongoServer()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())

function verifyJWT(req, res, next){ // middleware para verificação do token
    const token = req.headers['x-access-token']
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' })
    // todas as requisições devem incluir o x-access-token com o token no header da requisição
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' })
      req.userIdFromToken = decoded.id // se tudo estiver ok, salva no request para uso posterior
      next()
    })
}

// middleware
app.use(function(req, res, next){
    // em produção remover o *
    res.setHeader('Access-Control-Allow-Origin', '*')
    // cabeçalhos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, x-access-token')
    // métodos permitidos
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    next()
})

// parse json
app.use(bodyParser.json())

// rotas
app.get('/', (req, res) => {return res.send({msg: 'OK'})})
app.use('/auth', AuthRoute) 
app.use('/categoriaproduto', verifyJWT, CategoriaProdutoRoute) 
app.use('/user', verifyJWT, UserRoute) 
app.use('/produto', verifyJWT, ProdutoRoute) 
app.use('/pedido', verifyJWT, PedidoProdutoRoute) 


app.listen(PORT, (req, res) => {
    console.log(`Server na porta ${PORT}`)
}) // node index.js ou nodemon index.js
