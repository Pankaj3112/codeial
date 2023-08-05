var kue = require('kue');
var express = require('express');
var app = express();

app.use('/kue-api/', kue.app);

var port = 3000; // Change this port if needed
app.listen(port, function () {
    console.log('Kue dashboard is running on http://localhost:' + port + '/kue-api/');
});