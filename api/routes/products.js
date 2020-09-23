let express =require("express");
let router = express.Router();
let mongoose = require("mongoose");
let Product = require('../models/products');


//insert data with json data
router.post('/',( req, res, next)=>{    
    const product = new Product({
        _id :new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price
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
       
});

//show all data
router.get('/' ,( req, res, next)=>{
    Product.find()
        .select("name price _id")
        .exec()
        .then(result=>{
            const response = {
                count:result.length,
                allData :result.map(eachData =>{
                    return{
                        name : eachData.name,
                        price : eachData.price,
                        _id : eachData._id,
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
});

//show data with specific id
router.get('/:productId',( req, res, next)=>{
    let productId = req.params.productId;
    Product.findById(productId)
        .exec()
        .then(result =>{
            if(result){
                res.status(200).json({result})
            }else{
                res.status(404).json({message:'No valid entry data for your id'})
            }
           
        })
        .catch(err=>console.log(err));
})


//update data
router.patch('/:productsId' , ( req, res, next)=>{
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
   
});

//delete data
router.delete('/:productsId',( req, res, next)=>{
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
    
})
module.exports = router;