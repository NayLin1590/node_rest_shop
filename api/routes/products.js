let express =require("express");
let router = express.Router();
let multer = require("multer");
let chectAuth = require("../middleware/check-auth");
let productController = require("../controller/product")

let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null ,'./uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }    
});

let fileFilter = (req , file , cb)=>{
 if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null , true)
 }else{
    cb(null , false);
 }
 
}

let upload = multer({
    storage : storage,
    limits : {
        fileSize : 1024 * 1024 * 5 
    },
    fileFilter : fileFilter
});


//insert data with json data
router.post('/', chectAuth, upload.single('productImage'), productController.create_product);

//show all data
router.get('/', chectAuth , productController.get_all_products);

//show data with specific id
router.get('/:productId', chectAuth, productController.get_single_product);

//update data
router.patch('/:productsId' ,chectAuth, productController.update_product );

//delete data
router.delete('/:productsId', chectAuth, productController.delete_product);
module.exports = router;