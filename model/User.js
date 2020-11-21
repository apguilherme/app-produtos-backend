const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    nomeUser: {type: String, required: true},
    email: {type: String, required: true, index: { unique: true }},
    password: {type: String, required: true, select: false},
    enderecoUser: {type: String, required: true},
    telefone: {type: String, required: true},
    cpf: {type: String, required: true},
    cnpj: {type: String, required: false},
}, {timestamps: true})

module.exports = mongoose.model('User', UserSchema)
