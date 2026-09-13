const jwt = require('jsonwebtoken');

const isAuthenticated = async(req, res, next) => {
    const headers = req.headers;
    const token = headers.authorization.split(" ")[1];

    const verifyToken = jwt.verify(token, "anykey", (err, decoded) => {
        if(err){
            return false;
        }else{
            return decoded;
        }
    });
    //Saving the user in req object so that it is available in our pages
    if(verifyToken){
        req.user = verifyToken.id;
        next();
    }else{
        const err = new Error("Session expired. PLease login again.");
        next(err);
    }
};

module.exports = isAuthenticated;
