const User = require('../model/User')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')

// localhost:4000/auth

router.post('/login', async (req, res, next) => {

    let u = await User.findOne({email: req.body.email}).select('+password')
    if (u){ // if an user was found...
      if(u.password === req.body.password){ //auth ok
        const id = u._id
        const token = jwt.sign({ id }, process.env.SECRET, {
          expiresIn: 86400 // expires in 1 day
        })
        return res.json({ auth: true, token: token, _id: u._id })
      }
    }
    
    res.status(500).json({message: 'Login inválido!'})
})

router.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
})

// post de user

router.post('/user', [
  check('nomeUser', 'informe nome').not().isEmpty(),
  check('enderecoUser', 'informe endereço').not().isEmpty(),
  check('email', 'informe email').not().isEmpty(),
  check('password', 'informe uma senha').not().isEmpty(),
  check('telefone', 'informe telefone').not().isEmpty(),
  check('cpf', 'informe CPF').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req) // valida check
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
  }
  const dados = req.body
  try {
      let u = await User.findOne({ email: dados.email })
      if (u) {
          return res.status(400).json({ msg: 'email já utilizado' })
      }
      let user = new User(dados)
      await user.save()
      res.send(user)
  }
  catch (e) {
      return res.status(500).json({ erro: `${e.message}` })
  }
})

module.exports = router
