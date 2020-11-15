const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: [50, 'Maximum title length is 50 characters']
    },
    author: {
        type: String,
        required: true,
        maxlength: [25, 'Maximum author length is 25 characters']
    },
    isbn: {
        type: String,
        required: true,
        minlength: [10, 'Please insert valid ISBN'],
        maxlength: [10, 'Please insert valid ISBN']
    },
    cover_file_name: {
        type: String
    },
    isBorrowed: {
        type: Boolean
    }
}, {timestamps: true});

// fire a function before doc save
// to insert isBorrowed status
bookSchema.pre('save', async function(next){
    if(typeof(this.isBorrowed) === 'undefined'){
        this.isBorrowed = false;
    }
    
    next();
});


const Book = mongoose.model('Book', bookSchema);

module.exports = Book;