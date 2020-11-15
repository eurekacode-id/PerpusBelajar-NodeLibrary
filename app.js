const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bookRouters = require('./routes/bookRouters');
const authRouters = require('./routes/authRouters');
const { checkUser } = require('./middlewares/authMiddleware');
const favicon = require('serve-favicon')
const path = require('path')
const fileUpload = require('express-fileupload');
const { dbURI, logopath } = require('./secretsettings')

// initialize express app
const app = express();

// connect to MongoDB

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then((result) => app.listen(3000)) //the listen to request is moved here
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// register middleware & static files
app.use(express.static('public'));
//app.use(express.static(__dirname+'/public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(favicon(path.join(__dirname, 'public/images', 'favicon2.ico')))
app.use(fileUpload());


// register bootstrap & jquery
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
// app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));





// register routers
app.get('*', checkUser);
// default routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home', logopath: logopath });
});
// book routes
app.use('/books', bookRouters);
// auth routes
app.use(authRouters);

// register 404 routes
app.use((req, res) => {
    res. status(404).render('404', { title: 'Not Found', logopath: logopath});
})