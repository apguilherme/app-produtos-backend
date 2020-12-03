const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    nomeProduto: {type: String, required: true},
    unidadeMedida: {type: String, required: true},
    qualidade: {type: String, default: 'Novo', enum: ['Novo', 'Semi-novo', 'Com defeito', 'Quebrado', 'Velho'], required: true},
    descricao: {type: String, required: true},
    valorUnitario: {type: String, required: true},
    linkImagem: {type: String, required: true},
    quantidadeEstoque: {type: Number, required: true},
    enderecoProduto: {type: String, required: false},
    id_usuarioVendedor: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // popula o campo desejado de acordo com a ref no schema
    id_categoriaProduto: {type: mongoose.Schema.Types.ObjectId, ref: 'CategoriaProduto'}
}, {timestamps: true})

module.exports = mongoose.model('Product', ProductSchema)
