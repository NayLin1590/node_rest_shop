
let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");


let app = express();

let productRoutes = require('./api/routes/products');
let orderRoutes = require('./api/routes/orders');

let dburl = 'mongodb://nicholas:nicholas15@cluster0-shard-00-00.nzmmg.mongodb.net:27017,cluster0-shard-00-01.nzmmg.mongodb.net:27017,cluster0-shard-00-02.nzmmg.mongodb.net:27017/node-rest-shop?ssl=true&replicaSet=atlas-pd2691-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(dburl,{useNewUrlParser:true , useUnifiedTopology:true})
    .then(res=>console.log("connect to mongoAtlas"))
    .catch(err=>console.log(err));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use( ( req, res, next )=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With, Content-Type, Accept, Authorization"
    );

    if(req.method === "OPTIONS"){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});  
    }
    next();
});

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

app.use( (req, res, next)=>{
    let error = new Error("File not Found");
    error.status = 404;
    next(error);
});

app.use(( error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message : error.message
        }
    })
})

module.exports = app;