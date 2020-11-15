const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwtthelib;

    // check jwt token exists & verified
    if(token){
        jwt.verify(token, 'Th1s 1s 4 s3cr3t 0k!', (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else{
        res.redirect('/login');
    }
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwtthelib;
    if(token){
        jwt.verify(token, 'Th1s 1s 4 s3cr3t 0k!', async (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                console.log(user);
                res.locals.user = user;
                next();
            }
        });
    } else{
        res.locals.user = null;
        next();
    }
}



module.exports = { 
    requireAuth,
    checkUser 
};