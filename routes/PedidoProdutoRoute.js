const PedidoProduto = require('../model/Pedido_Produto')
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

// localhost:4000/pedido

router.get('/', async (req, res) => {
    try { // popula o campo desejado de acordo com a ref no schema
        const pedido = await PedidoProduto.find().populate('id_usuarioComprador').populate('id_produto')
        res.json(pedido)
    }
    catch (e) {
        res.send({ erro: `${e.message}` })
    }
})

router.post('/', [
    check('id_usuarioComprador', 'informe usuario comprador').not().isEmpty(),
    check('id_produto', 'informe produto pedido').not().isEmpty(),
    check('quantidadePedido', 'informe a quantidade').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req) // valida check
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    let dados = req.body
    dados = {...dados, dataPedido: new Date()}
    try {
        let pedido = new PedidoProduto(dados)
        await pedido.save()
        res.send(pedido)
    }
    catch (e) {
        return res.status(500).json({ erro: `${e.message}` })
    }
})

router.get('/:id', async (req, res) => { // busca pelo id
    await PedidoProduto.findById(req.params.id).populate('id_usuarioComprador').populate('id_produto')
        .then(pedido => { res.send(pedido) })
        .catch(e => { res.status(400).send({ erro: `${e.message}` }) })
})

router.delete('/:id', async (req, res) => { // apaga pelo id
    await PedidoProduto.findByIdAndRemove(req.params.id)
        .then(pedido => { res.send({ msg: 'removido com sucesso' }) })
        .catch(e => res.status(400).send({ erro: `${e.message}` }))
})

router.put('/', [
    check('id_usuarioComprador', 'informe usuario comprador').not().isEmpty(),
    check('id_produto', 'informe produto pedido').not().isEmpty(),
    check('quantidadePedido', 'informe a quantidade').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req) // valida checks
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const dados = req.body
    await PedidoProduto.findByIdAndUpdate(
        { _id: dados._id }, dados, { new: true }, function (err, result) {
            if (err) {
                res.send(err)
            }
            else {
                res.send({ msg: 'atualizado com sucesso' })
            }
        })
})


// pedidos pertecentes a um dado usuário 
// localhost:4000/pedido/user/id_user

router.get('/user/:id', async (req, res) => { 
    try { // popula o campo desejado de acordo com a ref no schema
        const pedidos = await PedidoProduto.find({id_usuarioComprador: req.params.id}).populate('id_usuarioComprador').populate('id_produto')
        res.json(pedidos)
    }
    catch (e) {
        res.send({ erro: `${e.message}` })
    }
})


module.exports = router
