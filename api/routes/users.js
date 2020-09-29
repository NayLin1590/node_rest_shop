let express =require("express");
let router = express.Router();
let userController = require("../controller/user");

router.post('/signup', userController.signup_user);

router.post('/login' , userController.login_user);

router.get('/userInfo' , userController.getUserInfo);

router.delete('/deleteUser/:userId', userController.delete_user);

module.exports = router;

