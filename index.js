let express = require('express');
let app = express();
let dotenv = require('dotenv');
dotenv.config()
let port = process.env.PORT || 2800;
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let mongoUrl = process.env.LiveMongo;
let cors = require('cors')
let bodyParser = require('body-parser');
const mongoose = require("mongoose");
const AuthController = require('./controllers/auth-Controller');
let db = null;

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send({
        message:'Hello Kishore kumar',
        status : 200
    })
})

app.listen(port, ()=>{
    console.log(`This site is running on ${port}`)
})

app.post('/additemdetails', (req, res) => {
    if (db) {
        db.collection('products').insertOne(req.body, (err, result) => {
            if (err) {
                res.send({
                    message: 'Server side  error!',
                    status: 500
                });
            } else {

                res.send({ status: 200, message: "item details added successfully" })
            }
        })
    } else {
        response.send({
            message: 'Db connection error!',
            status: 500
        });
    }

})

app.get('/viewItemDetails',  (request, response)=> {
    if (db) {
        db.collection('products').find().toArray( (error, result) =>{
            if (error) {
                response.send({
                    message: 'not found!',
                    status: 404
                });
            } else {

                response.send({ status: 200, message: "item details retrieved successfully", data: result })
            }
        })
    } else {
        response.send({
            message: 'Db connection error!',
            status: 500
        });
    }
})

app.put('/updateitemdetails',(request, response)=>{
    if (db) {
        db.collection('products').updateOne({ _id: ObjectID(request.body.id) }, {
            $set: {
                image: request.body.image
            }
        }, function (error, result) {
            if (error) {
                response.send({
                    message: 'not found!',
                    status: 404
                });
            } else {

                response.send({ status: 200, message: "item details updated successfully" })
            }
        })
    } else {
        response.send({
            message: 'Db connection error!',
            status: 500
        });
    }
})

app.delete('/deleteitemdetails',(request, response)=>{
    if (db) {
        db.collection('products').deleteOne({ _id: ObjectID(request.body.id) }, function (err, result)  {
            if (err) {
                res.send({
                    message: 'Server side  error!',
                    status: 500
                });
            } else {

                response.send({ status: 200, message: "item  details deleted successfully" })
            }
        })
    } else {
        response.send({
            message: 'Db connection error!',
            status: 500
        });
    }
})

app.get('/category_id',(req,res)=>{
    let categoryId = Number(req.query.categoryId);
    let prodId = Number(req.query.prodId)
    let query = {}
    if(categoryId){
        query = {category_id:categoryId}
    }else if(prodId){
        query = {"itemTypes.type_id":prodId}
    }else{
        query = {}
    }
    db.collection('products').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// filter items
app.get('/filter/:productId',(req,res) => {
    let query = {};
    let sort = {cost:1};
    let categoryId=Number(req.params.Categoryid);
    let productId = Number(req.params.productid);
    let type = Number(req.query.typeId);
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);

    if(req.query.sort){
        sort={cost:req.query.sort}
    }

    if(hcost && lcost && categoryId){
        query={
            "itemTypes.type_id":productId,
            $and:[{cost:{$gt:lcost,$lt:hcost}}]
        }
    }
    else if(hcost && lcost){
        query={
            "itemTypes.type_id":productId,
            $and:[{cost:{$gt:lcost,$lt:hcost}}]
        }
    }
    else if(categoryId){
        query={
            "itemTypes.type_id":productId,
            "category.category_id":categoryId
        }
    }else{
        query={
            "itemTypes.type_id":productId
        }
    }
    db.collection('products').find(query).sort(sort).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


// order details
app.get('/orders',(req,res)=>{
    //let email = req.query.email
    let email = req.query.email;
    let query = {}
    if(email){
        //query={email:email}
        query={email}
    }else{
        query={}
    }
    db.collection('orders').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// view orders
app.get('/orders',(req,res)=>{
    //let email = req.query.email
    let email = req.query.email;
    let query = {}
    if(email){
        //query={email:email}
        query={email}
    }else{
        query={}
    }
    db.collection('orders').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


// place an order
app.post('/placeOrder',(req,res) => {
    db.collection('orders').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send('Order Placed')
    })
})

//update order

app.put('/updateOrder/:id',(req,res) => {
    let oid = Number(req.params.id);
    db.collection('orders').updateOne(
        {id:oid},
        {
            $set:{
                "status":req.body.status,
                "bank_name":req.body.bank_name,
                "date":req.body.date
            }
        },(err,result) => {
            if(err) throw err;
            res.send('Order Updated')
        }
    )
})

app.delete('/deleteOrder/:id',(req,res) => {
    let _id = mongo.ObjectId(req.params.id);
    db.collection('orders').remove({_id},(err,result) => {
        if(err) throw err;
        res.send('Order Deleted')
    })
})

// connecting to db
// const connectDB = async () => {
//     const conn = await mongoose
//       .connect(process.env.LiveMongo, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       })
//       .catch((err) => {
//         console.log("error: ", err);
//       });
  
//     console.log(`Mongoose Connected: ${conn.connection.host}`.cyan.underline.bold);
//   };
  
//   module.exports = connectDB;
// MongoClient.connect(mongoUrl,(err,client) => {
//     if(err) console.log('Error while connecting');
//     db = client.db('asianpaints');
//     app.listen(port,()=>{
//         console.log(`Server is running on port ${PORT}`)
//     })

// })


const connectionURL = "mongodb+srv://looser:looser24@cluster0.sqdrli8.mongodb.net/?retryWrites=true&w=majority"
const dbName = "AP"

//get MongoClient


MongoClient.connect(connectionURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
},(err,connectedClient) => {
    if(err){
        throw err;
    }
    //connectedClient will be the connected instance of MongoClient
    db = connectedClient.db(dbName);
    //now you can write queries

    db.collection("products").find({}).toArray()
    .then(r => {
        console.log(r);
    }).catch(e => {
        console.error(`ERROR:`,e);
    })

})


// user
app.use('/api/auth',AuthController);
