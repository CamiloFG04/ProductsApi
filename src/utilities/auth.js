
const token = require('jsonwebtoken');
const secrect = 'secretvrm';

function generateAccessToken(email) {
    return token.sign({email:email},secrect,{expiresIn:'50m'});
}

function validatedToken(request,response,next) {
    const accesstoken = request.headers['authorization'];
    if (!accesstoken) {
        response.json({status:401,message:'access denied'})
    }else{
        token.verify(accesstoken,secrect,(error,user)=>{
            if (error) {
                response.json({status:401,message:'access denied, token expired or incorrect'})
            }else{
                request.user = user;
                next();
            }
        });
    }
}

module.exports = {generateAccessToken,validatedToken};