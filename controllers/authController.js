const User = require('../models/user');
const jwt = require('jsonwebtoken');
let logopath = '../images/logo.jpg';

// signup_get
const signup_get = (req, res) => {
    res.render('signup', {title: 'Signup Page', logopath: logopath});
};

// signup_post
const signup_post = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.create({ email, password});
        //create jwt
        const token = createToken(user._id);
        res.cookie('jwtthelib', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({user: user._id});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

// login_get
const login_get = (req, res) => {
    res.render('login', {title: 'Login Page', logopath: logopath});
};

// login_post
const login_post = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.login(email, password);
        //create jwt
        const token = createToken(user._id);
        res.cookie('jwtthelib', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({user: user._id});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

// addadmin_get
const addadmin_get = (req, res) => {
    res.render('addadmin', {title: 'Add Admin Page', logopath: logopath});
};

// addadmin_post
const addadmin_post = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.create({ email, password, role: 'admin'});
        //create jwt
        const token = createToken(user._id);
        res.cookie('jwtthelib', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({user: user._id});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

// logout_get
const logout_get = (req, res) => {
    res.cookie('jwtthelib', '', {maxAge: 1 });
    res.redirect('/');
}

// handleErrors
const handleErrors = (err) => {
    let errors = { email: '', password: ''};
    console.log(err)
    // LoginErrorEmail
    if(err.message.includes('LoginErrorEmail')){
        errors.email = 'That email is not registered';
    }
    // LoginErrorPassword
    if(err.message.includes('LoginErrorPassword')){
        errors.password = 'Password is incorrect';
    }
    // validation errors
    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};

// JWT create token
const maxAge = 1 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign( { id }, 'Th1s 1s 4 s3cr3t 0k!', {
        expiresIn: maxAge
    });
};


module.exports = {
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get,
    addadmin_get,
    addadmin_post
}