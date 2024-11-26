/* Imports */
    // Packages
    const express = require('express');
    const app = express();
    const path = require('path');
    const cookieParser = require('cookie-parser');
    const cors = require('cors');
    
    // Modules
    const routes = require('./routes/routes.js');
    const {vue} = require('./generator');
/* Imports (End) */

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:8080',  // Only allow requests from the frontend
    credentials: true
}));

// Setting: the view engine to ejs, & the public folder
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use((req, res, next) => {
    const currentDateTime = new Date().toLocaleString(); // Gets the current date and time
    console.log(`[${currentDateTime}] ${req.method} ${req.url}`);
    next();
})

// Routes
app.use('/github', routes.github);
app.use('/frontend', routes.ui);
app.use('/backend', routes.api);
app.use('/scripts', routes.github);

const generator = require('./generator')
generator.vue.createVueProject('my-proj', './output')

app.listen(3000, () => {
    console.log('Server is running...');
    console.log(`http://localhost:3000/`);
});