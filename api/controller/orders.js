let Product = require("../models/products");
let Order = require("../models/orders");
let mongoose = require("mongoose");

exports.create_order = ( req, res, next)=>{
    Product.findById(req.body.productId)
        .exec()
        .then(product =>{
            if(!product){
                return res.status(500).json({
                    message : "id not found"
                });
            }
            let order = new Order({
                _id : mongoose.Types.ObjectId(),
                quantity : req.body.quantity,
                product : req.body.productId
            });
            return order.save(),product;
                
        })
        .then(result =>{
            res.status(200).json({
                message: "Order created",
                productid : result._id,
                quantity : req.body.quantity,
                productName : result.name
                // result : result
            });
        }) 
        .catch(err => {
            res.status(500).json({
                message : "Your ProductID is not available in Our Services",
                error : err
            })
        });
   
};  

exports.get_all_orders = ( req, res, next)=>{
   
    Order.find()
        .select("quantity product _id")
        .populate('product', 'name')
        .exec()
        .then(result => {
            res.status(200).json({
                count : result.length,
                AllOrder : result.map(eachOrder =>{
                    return {
                        quantity : eachOrder.quantity,
                        product : eachOrder.product,
                        request : {
                            type : "GET",
                            url : "http://localhost:3000/orders/"+eachOrder._id,
                          
                        },
                        deleteRequest : {
                            type : "DELETE",
                            url : "http://localhost:3000/orders/"+eachOrder._id,
                            body : {
                                orderId : "ID"
                            }
                        }
                    }
                })
            })
        })
        .catch(err => {
            res.status(404).json({err
            });        
        });
};

exports.get_single_order = ( req, res, next)=>{
    let id = req.params.orderId;
    Order.findById(id)
        .exec()
        .then(result =>{
            if (result){
                res.status(200).json({
                    orderID : result._id,
                    productID : result.productId,
                    quantity : result.quantity,
                    request : {
                        type : "GET",
                        url : "http://localhost:3000/orders"
                    }
                })
            }else{
                res.status(500).json({
                    message : "Your ProductId is not valid"
                })
            }
        })
};

exports.delete_order =( req, res, next)=>{
    let orderId = req.params.orderId ;

    Order.remove({_id : orderId})
        .then(result =>{
            res.status(200).json({
                message :'Orders is deleted',
                request :{
                    type : "POST",
                    url : "http://localhost:3000/orders",
                   
                }
            });
        })
        .catch(err => {
            res.status(404).json({
                message : "unsuccessful"
            })
        }) 
};