const Book = require('../models/book');
const path = require('path');
const moment = require('moment');
const fs = require('fs');
// const { findById } = require('../models/book');
let logopath = '../images/logo.jpg';

// book_index
const book_index = (req, res) => {

    Book.find().sort({ createdAd: -1 })
        .then((result) => {
            console.log(result);
            res.render('books/index', { title: 'Books Page', books: result, logopath: logopath});
        })
        .catch((err) => {
            console.log(err);
        });
};

// book_details
const book_details = (req, res) => {
    Book.findById(req.params.id)
        .then((result) => {
            res.render('books/details', {book: result, title: `${result.title}`, logopath: logopath});
        })
        .catch((err) => {
            console.log(err);
            res.render('404', {title: 'Not found'});
        });
};

// book_create_get
const book_create_get = (req, res) => {
    res.render('books/create', { title: 'Add new book', logopath: logopath});
};

// book_create_post
const book_create_post = (req, res) => {
    console.log('book_create_post');
    const book = new Book(req.body);
    let cover_file_name = '';
    //try{
        
    if (req.files && Object.keys(req.files).length >= 0) {
        // upload files here
        let postedFile = req.files.cover_file_name;
        cover_file_name = moment().format('YYYYMMDDhhmmss') + '_' + postedFile.name;
        //console.log(cover_file_name);
        // Use the mv() method to place the file somewhere on your server
        let pathFile = path.join(__dirname, '..', 'public/images/books', cover_file_name);
        postedFile.mv(pathFile , function(err) {
             if (err){
                 console.log(err);
             }
        });
    }
    
    if(cover_file_name !== ''){
        book.cover_file_name = cover_file_name;
    }

    book.save()
        .then((result) => {
            res.redirect('/books');
        })
        .catch((err) => {
            console.log(err);
            // const errors = handleErrors(err);
            // res.status(400).json({ errors });
        });
    
};

// book_edit_get
const book_edit_get = (req, res) => {
    book = Book.findById(req.params.id)
        .then((result) => {
            res.render('books/edit', {title: `${result.title}`, logopath: '../' + logopath, book: result});
        })
        .catch((err) => {
            console.log(err);
            res.render('404', {title: 'Not found'});
        });
};

// book_edit_post
const book_edit_post = (req, res) => {
    console.log('book_edit_post');
    let postedFile = '';

    newBook = {
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn
    }

    if (req.files && Object.keys(req.files).length >= 0) {
        postedFile = req.files.cover_file_name;
        newBook['cover_file_name'] = moment().format('YYYYMMDDhhmmss') + '_' + postedFile.name;
    }

    Book.findByIdAndUpdate(req.params.id, { $set: newBook })
        .then(book => {
            let pathFile = path.join(__dirname, '..', 'public/images/books', newBook['cover_file_name']);
            postedFile.mv(pathFile , function(err) {
                if (err){
                    console.log(err);
                }
            });
            
            let oldPathFile = path.join(__dirname, '..', 'public/images/books', book.cover_file_name);
            fs.unlink(oldPathFile, (err) => {
                if (err) throw err;
                console.log('file was deleted');
            });

            res.redirect('/books');
        })
        .catch((err) => {
            console.log(err);
            res.render('404', {title: 'Not found'});
        });
};

// book_delete
const book_delete = (req, res) => {
    console.log(`delete ${req.params.id}`);
    Book.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.json({redirect: '/books'});
        })
        .catch((err) => {
            console.log(err);
            // const errors = handleErrors(err);
            // res.status(400).json({ errors });
        });
};

// handleErrors
const handleErrors = (err) => {
    let errors = { cover_file_name};
    console.log(err)
    // LoginErrorEmail
    if(err.message.includes('FileNotFound')){
        errors.email = 'File is not found';
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


module.exports = {
    book_index,
    book_details,
    book_create_get,
    book_create_post,
    book_delete,
    book_edit_get,
    book_edit_post
}