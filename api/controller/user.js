
let mongoose = require("mongoose");
let User = require('../models/user');
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
let secret = "nodetoken" || process.env.JWT_SECRET ;

exports.signup_user = ( req, res, next)=>{
    User.find({email : req.body.email})
        .exec()
        .then(user =>{
            if(user.length >= 1){
                res.json({
                    message : "Mail exists"
                })
            }else{
                bcrypt.hash(req.body.password , 10, (err, hash)=>{
                    if(err){
                        res.status(505).json({
                            message : "your password is not strong",
                            error : err
                        });
                    }else{
                        let user = new User({
                            _id : new mongoose.Types.ObjectId(),
                            email : req.body.email ,
                            password : hash
                        });
                        user.save()
                        .then(user =>{
                            res.status(200).json({
                                message : "successful user creation",
                                user : user
                        
                            });
                        })
                        .catch(err =>{
                            res.status(304).json({                              
                                message : "creation unsuccessful",
                                error : err
                            })
                        });
                    }
                })
            }
        })
        .catch(err=>{
            res.status(405).json({
                message : "errror",
                error : err
            });
        });  
};

exports.login_user = ( req, res, next )=>{
    User.find({ email : req.body.email})
        .exec()
        .then(user =>{
            if(user.length < 1){
                return res.status(401).json({
                    message : "Auth Fail! \n ur email don't exit"
                    
                });
            }
            bcrypt.compare(req.body.password , user[0].password , (err , result )=>{
                if(err){
                    return res.status(401).json({
                        message : "Auth Fail! \n ur password is wrong "
                    })
                }
                if(result){
                    let token = jwt.sign(
                        {
                            email : user[0].email ,
                            userId : user[0]._id
                        },
                        secret,
                        {
                            expiresIn: "1h"
                        }
                        );
                    return res.status(200).json({                     
                        message : "Auth Successful !",
                        token : token
                    });
                }else{
                    return res.status(401).json({
                        message : "Auth Fail! \n ur password is wrong "
                    })
                }
            })
        })
        .catch(err =>{
            res.status(500).json({
                err : err
            });
        })
};

exports.getUserInfo =  (req, res, next)=>{
    User.find()
        .exec()
        .then(user =>{
            res.status(200).json({
                count : user.length,
                infomation : user.map(oneuser =>{
                    return {
                        email : oneuser.email,
                        password : oneuser.password,
                        response : {
                            message : "want to delete these user let click to url link",
                            type : "DELETE",
                            url : `http://localhost:3000/users/deleteUser/${oneuser._id}`
                        }
                    }
                }),
               
            })
        })
        .catch(err =>{
            console.log(err);
        });
};

exports.delete_user =  (req, res, next) =>{
    User.remove({_id : req.params.userId})
        .exec()
        .then(result =>{
            res.json({
                message : `Delete the userID ${req.params.userId}` 
            });
        })
        .catch(err =>{
            res.status(404).json({
                message : "userid is invalid"
            })
        })
};