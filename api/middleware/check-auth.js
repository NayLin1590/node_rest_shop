let jwt = require("jsonwebtoken");
let secret = "nodetoken" || process.env.JWT_SECRET ;


module.exports = (req, res, next )=>{
    try{
        let token = req.headers.authorization.split(" ")[1];

        let decode = jwt.verify(token ,secret );

        req.userDecode = decode;
        next();
    }catch(error){
        return res.status(401).json({
            message : "Auth Fail"
        })
    }
}