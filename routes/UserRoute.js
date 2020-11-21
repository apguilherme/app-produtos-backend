const User = require('../model/User')
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

// localhost:4000/user

router.get('/', async (req, res) => {
    try {
        const user = await User.find()
        res.json(user)
    }
    catch (e) {
        res.send({ erro: `${e.message}` })
    }
})

router.post('/', [
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

router.get('/:id', async (req, res) => { // busca pelo id
    await User.findById(req.params.id)
        .then(user => { res.send(user) })
        .catch(e => { res.status(400).send({ erro: `${e.message}` }) })
})

router.delete('/:id', async (req, res) => { // apaga pelo id
    await User.findByIdAndRemove(req.params.id)
        .then(categoria => { res.send({ msg: 'removido com sucesso' }) })
        .catch(e => res.status(400).send({ erro: `${e.message}` }))

    // TODO: também deletar todos os produtos e pedidos desse user 
})

router.put('/', [
    check('nomeUser', 'informe nome').not().isEmpty(),
    check('enderecoUser', 'informe endereço').not().isEmpty(),
    check('email', 'informe email').not().isEmpty(),
    check('telefone', 'informe telefone').not().isEmpty(),
    check('cpf', 'informe CPF').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req) // valida checks
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const dados = req.body
    await User.findByIdAndUpdate(
        { _id: dados._id }, dados, { new: true }, function (err, result) {
            if (err) {
                res.send(err)
            }
            else {
                res.send({ msg: 'atualizado com sucesso' })
            }
        })
})

module.exports = router
