const CategoriaProduto = require('../model/CategoriaProduto')
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

// localhost:4000/categoriaproduto

router.get('/', async (req, res) => {
    try {
        const categorias = await CategoriaProduto.find().sort({ nome: 1 })
        res.json(categorias)
    }
    catch (e) {
        res.send({ erro: `${e.message}` })
    }
})

router.post('/', [
    check('nomeCategoriaProduto', 'informe nome da categoria').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req) // valida check
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { nomeCategoriaProduto } = req.body
    try {
        let categoria = new CategoriaProduto({ nomeCategoriaProduto })
        await categoria.save()
        res.send(categoria)
    }
    catch (e) {
        return res.status(500).json({ erro: `${e.message}` })
    }
})

router.get('/:id', async (req, res) => { // busca pelo id
    await CategoriaProduto.findById(req.params.id)
        .then(categoria => { res.send(categoria) })
        .catch(e => { res.status(400).send({ erro: `${e.message}` }) })
})

router.delete('/:id', async (req, res) => { // apaga pelo id
    await CategoriaProduto.findByIdAndRemove(req.params.id)
        .then(categoria => { res.send({ msg: 'removido com sucesso' }) })
        .catch(e => res.status(400).send({ erro: `${e.message}` }))
})

router.put('/', [
    check('nomeCategoriaProduto', 'informe nome da categoria').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req) // valida checks
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const dados = req.body
    await CategoriaProduto.findByIdAndUpdate(
        { _id: dados._id }, { nomeCategoriaProduto: dados.nomeCategoriaProduto }, { new: true }, function (err, result) {
            if (err) {
                res.send(err)
            }
            else {
                res.send({ msg: 'atualizado com sucesso' })
            }
        })
})

module.exports = router
