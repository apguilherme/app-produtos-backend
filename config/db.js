const mongoose = require('mongoose')

const MONGOURI = process.env.MONGODB_URL

const InitMongoServer = async() => {
    try{
        await mongoose.connect(MONGOURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
        })
        console.log('mongo conectado...')
    }
    catch(e){
        console.log('mongo NAO conectado: ', e)
    }
}

module.exports = InitMongoServer
