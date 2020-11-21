const User = require('../model/User')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

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

module.exports = router
