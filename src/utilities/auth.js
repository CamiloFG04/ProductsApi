
const token = require('jsonwebtoken');
const { User } = require('../models/Models');
const secrect = 'secretvrm';

function generateAccessToken(user) {
    return token.sign(user,secrect,{expiresIn:'50m'});
}

const validatedToken = (roles) =>  (request,response,next) => {
    const accesstoken = request.headers['authorization'];
    if (!accesstoken) {
        response.json({status:401,message:'access denied'})
    }else{
        token.verify(accesstoken,secrect,async (error,user)=>{
            if (error) {
                response.json({status:401,message:'access denied, token expired or incorrect'})
            }else{
                request.user = user;
                let checkRol = await checkRoleAuth(roles,user,response,next);
                if (checkRol) {
                    next();
                }else{
                    response.status(409).json({status:409,message:"You don't have the permissions"});
                }
            }
        });
    }
}

const  checkRoleAuth = async (roles,u) =>  {
    try {
        const user = await User.findOne({
            where:{
                email:u.email
            }
        });
        if (roles.includes(user.rol)) {
            return true;
        }else{
            return false 
        }
    } catch (error) {
        console.log(error);
        return false 
    }
}

module.exports = {generateAccessToken,validatedToken,checkRoleAuth};