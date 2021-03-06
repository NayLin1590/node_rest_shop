let mongoose = require("mongoose");

let orderScheme = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    product : {type : mongoose.Schema.Types.ObjectId , ref : "product" , required : true},
    quantity : {type : Number , default : 1}
});

module.exports = mongoose.model("Order",orderScheme);