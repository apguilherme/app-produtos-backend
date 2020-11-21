const mongoose = require('mongoose')

const PedidoProdutoSchema = mongoose.Schema({ // popula o campo desejado de acordo com a ref no schema
    id_usuarioComprador: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
    id_produto: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'}, 
    quantidadePedido: {type: Number, required: true},
    dataPedido: {type: Date, required: true},
}, {timestamps: true})

module.exports = mongoose.model('PedidoProduto', PedidoProdutoSchema)
