const mongoose = require('mongoose')

const CategoriaProdutoSchema = mongoose.Schema({
    nomeCategoriaProduto: {type: String, required: true},
})

module.exports = mongoose.model('CategoriaProduto', CategoriaProdutoSchema)
