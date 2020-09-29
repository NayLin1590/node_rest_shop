let express = require("express");
let router = express.Router();
let checkAuth = require("../middleware/check-auth");
let orderController = require("../controller/orders")

router.post('/', checkAuth, orderController.create_order );

router.get('/', checkAuth ,orderController.get_all_orders);

router.get('/:orderId', checkAuth, orderController.get_single_order );
   
router.delete('/:orderId',checkAuth, orderController.delete_order);
     
module.exports = router;