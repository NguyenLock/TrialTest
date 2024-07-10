const Members = require('../models/member');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class memberController{
    async APILogin(req,res,next){
        try{
            const {username, password} = req.body;
            if(!username || !password){
                return res.status(400).json({
                    status: "Error",
                    message: "Missing Parameter",
                    Description: "Please provide username and password",
                });
            }
            const member = await Members.findOne({username: username});
            if(!member){
                return res.status(400).json({
                    "status": "Error",
                    "message": "Member Not Found",
                    "description": `Member with username ${username} is not found.`
                })
            }
            //check Password
            const isMatch = await bcrypt.compare(password, member.password);
            if(isMatch){
                //create token
                const token = jwt.sign({
                    id: member._id,
                    username: member.username
                },"TrialTest", {expiresIn: "1d"});
                return res.status(200).json({
                    "status": "success",
                    "data":{
                        "tokenType":"Bearer",
                        "token": token
                    },
                    "message": "Login Success"
                });
            }else{
                return res.status(500).json({
                    "status": "Error",
                    "message": "Login Failed",
                    "description": "Wrong username or password"
                });
            }

        }catch(error){
            return res.status(500).json({
                "status": "Error",
                "message": "Internet Server Error",
                "description": error.message
            });
        }
    };
}

module.exports = new memberController;