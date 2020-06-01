const jwt = require('jsonwebtoken')

//middleware to make a couple to checks we have a valid token but never throuw err, yet helps fething the data related to the user
module.exports = (req, res, next) =>{
    //have a look at the incoming requests make sure it is autherized to block or allow requests
    const authHeader = req.get('Authorization')
    if (!authHeader){
        //if not autherized only allow specific requests from the rsesolvers
        //each resolver function can check if the user is authenticated or not then allow or block access
        req.isAuth = false;
        return next();//to avoid any other code after this gets excuted
    }
    const token = authHeader.split(' ')[1];//Authentication: Bearer token, to split bearer from the token 
    if (!token || token === ''){//if no or false token 
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    //to verify
    try{
        decodedToken = jwt.verify(token, 'somesupersecretkey');// all tokens with the same key will be vaild tokens
    }catch(err){
        req.isAuth = false;
        return next();
    }
    if(!decodedToken){
        req.isAuth = false;
        return next();
    }
    req.isAuth = true,
    req.userId = decodedToken.userId;//we saved the user id in the toked object
    next(); 

}

