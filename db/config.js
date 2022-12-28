const MongoClient = require('mongodb').MongoClient;

const MongoURL= "mongodb://localhost:27017";

const client = new MongoClient(MongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

module.exports = client;

module.exports = {
    'secret':'SuperSecret'
}
