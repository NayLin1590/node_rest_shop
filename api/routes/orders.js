let express = require("express");

let router = express.Router();

router.get('/', ( req, res, next)=>{
 res.status(200).json({
     message :'Orders is comming with get request'
 });
});

router.post('/', ( req, res, next)=>{
    let order = {
        productId:req.body.productId,
        quantity :req.body.quantity
    }
    res.status(201).json({
        message :'Orders is comming with post request',
        order:order
    });
});

router.get('/:orderId', ( req, res, next)=>{
    res.status(200).json({
        message :'Orders is comming',
        orderID : req.params.orderId
    });
});
   
router.delete('/:orderId', ( req, res, next)=>{
    res.status(200).json({
        message :'Orders is deleted',
        orderID : req.params.orderId
    });
});
   
   
module.exports = router;