//Express server
const express = require('express');
const app = express();
const port = 8000;

//...Session and Cookies....
const cookieParser = require('cookie-parser');

app.use(express.urlencoded());
app.use(cookieParser());

//...Models....
//Database
const db = require('./config/mongoose');

//...Views....
//Layouts
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

//Assets
app.use(express.static('./assets'));
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//View Engine
app.set('view engine', 'ejs');
app.set('views', './views');

//...Controller....
//Router
app.use('/', require('./routes'));




app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
        return;
    }
    console.log(`Server is running on port ${port}`);
});