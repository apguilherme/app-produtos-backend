const Product = require('../model/Produto')
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

// localhost:4000/produto

router.get('/', async (req, res) => {
    try { // popula o campo desejado de acordo com a ref no schema
        const product = await Product.find().populate('id_usuarioVendedor').populate('id_categoriaProduto')
        res.json(product)
    }
    catch (e) {
        res.send({ erro: `${e.message}` })
    }
})

router.post('/', [
    check('nomeProduto', 'informe nome').not().isEmpty(),
    check('unidadeMedida', 'informe unidade de medida').not().isEmpty(),
    check('qualidade', 'informe a qualidade').not().isEmpty(),
    check('descricao', 'informe a descrição').not().isEmpty(),
    check('valorUnitario', 'informe o valor unitário').not().isEmpty(),
    check('enderecoProduto', 'informe o endereço do produto').not().isEmpty(),
    check('id_usuarioVendedor', 'informe o usuário anunciante do produto').not().isEmpty(),
    check('id_categoriaProduto', 'informe a categoria do produto').not().isEmpty(),
    check('linkImagem', 'informe o link para a imagem').not().isEmpty(),
    check('quantidadeEstoque', 'informe a quantidade em estoque').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req) // valida check
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const dados = req.body
    try {
        let product = new Product(dados)
        await product.save()
        res.send(product)
    }
    catch (e) {
        return res.status(500).json({ erro: `${e.message}` })
    }
})

router.get('/:id', async (req, res) => { // busca pelo id
    await Product.findById(req.params.id).populate('id_usuarioVendedor').populate('id_categoriaProduto')
        .then(product => { res.send(product) })
        .catch(e => { res.status(400).send({ erro: `${e.message}` }) })
})

router.delete('/:id', async (req, res) => { // apaga pelo id
    await Product.findByIdAndRemove(req.params.id)
        .then(categoria => { res.send({ msg: 'removido com sucesso' }) })
        .catch(e => res.status(400).send({ erro: `${e.message}` }))
})

router.put('/', [
    check('nomeProduto', 'informe nome').not().isEmpty(),
    check('unidadeMedida', 'informe unidade de medida').not().isEmpty(),
    check('qualidade', 'informe a qualidade').not().isEmpty(),
    check('descricao', 'informe a descrição').not().isEmpty(),
    check('valorUnitario', 'informe o valor unitário').not().isEmpty(),
    check('enderecoProduto', 'informe o endereço do produto').not().isEmpty(),
    check('id_usuarioVendedor', 'informe o usuário anunciante do produto').not().isEmpty(),
    check('id_categoriaProduto', 'informe a categoria do produto').not().isEmpty(),
    check('linkImagem', 'informe o link para a imagem').not().isEmpty(),
    check('quantidadeEstoque', 'informe a quantidade em estoque').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req) // valida checks
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const dados = req.body
    await Product.findByIdAndUpdate(
        { _id: dados._id }, dados, { new: true }, function (err, result) {
            if (err) {
                res.send(err)
            }
            else {
                res.send({ msg: 'atualizado com sucesso' })
            }
        })
})


// produtos pertecentes a um dado usuário 
// localhost:4000/produto/user/id_user

router.get('/user/:id', async (req, res) => { 
    try { // popula o campo desejado de acordo com a ref no schema
        const products = await Product.find({id_usuarioVendedor: req.params.id}).populate('id_usuarioVendedor').populate('id_categoriaProduto')
        res.json(products)
    }
    catch (e) {
        res.send({ erro: `${e.message}` })
    }
})


module.exports = router
