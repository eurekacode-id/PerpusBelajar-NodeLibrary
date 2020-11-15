const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [2, 'Minimum password length is 2 characters']
    },
    role: {
        type: String,
        lowercase: true
    }
});

// fire a function before doc save
// to insert Role and hash Password
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    console.log(this.role);
    if(typeof(this.role) === 'undefined'){
        this.role = 'user';
    }
    console.log(this.role);

    next();
});

// static method to login
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email });
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('LoginErrorPassword');
    }
    throw Error('LoginErrorEmail');
}

const User = mongoose.model('User', userSchema);

module.exports = User;