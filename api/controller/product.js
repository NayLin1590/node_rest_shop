let Product = require("../models/products");
let mongoose = require("mongoose");

exports.create_product = ( req, res, next)=>{ 
    console.log(req.file);   
    const product = new Product({
        _id :new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price,
        productImage : req.file.path
    }) ;

    product.save()
        .then(result =>{
            res.status(201).json({
                message:'post request to / products',
                createProduct :{
                    name : result.name,
                    price : result.price,
                    _id : result._id,
                    request:{
                        type:'GET',
                        url:"http://localhost:3000/products/"+product._id
                    }
                },
               
              
            });
        })
        .catch(err=>res.status(300).json(err));
       
};

exports.get_all_products = ( req, res, next)=>{
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then(result=>{
            const response = {
                count:result.length,
                allData :result.map(eachData =>{
                    return{
                        name : eachData.name,
                        price : eachData.price,
                        _id : eachData._id,
                        productImage : eachData.productImage,
                        request:{
                            type:"GET",
                            url : "http://localhost:3000/products/"+eachData._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err=>console.log(err))
};

exports.get_single_product = ( req, res, next)=>{
    let productId = req.params.productId;
    Product.findById(productId)
        .exec()
        .then(result =>{
            if(result){
                res.status(200).json({
                    id: result._id,
                    name : result.name,
                    price : result.price
                })
            }else{
                res.status(404).json({message:'No valid entry data for your id'})
            }
           
        })
        .catch(err=>console.log(err));
};

exports.update_product =  ( req, res, next)=>{
    let id = req.params.productsId;
    // { name: req.body.newName , price: req.body.newPrice}
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] =ops.value;
    }
    Product.update({ _id: id}, { $set:updateOps })
        .exec()
        .then(result =>{            
            res.status(200).json({
                message : "update successful!",
                response :{
                    type : "GET",
                    url : "http://localhost:3000/products/"+id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message:"not done"});
        });
};

exports.delete_product =  ( req, res, next)=>{
    let id = req.params.productsId;
    Product.remove({_id : id})
        .then(result=>{
            res.status(200).json({
                result:result,
                message:`Deleted the Product id ${id}`,
                request : {
                    type : "POST",
                    url : "http://localhost:3000/products/",
                    body : {
                        name : "String",
                        price : "Number"
                    }
                }
            })
        })
        .catch(err=>console.log(err))
    
};