var express = require('express');
var app = express();
var serverPort = 3000;

app.get('/user-data.txt', function(req, res){
    setTimeout((function() {res.send('test')}), 5000);
});

app.use(express.static('public'));

app.listen(serverPort, function(){
    console.log('This mock server runs on port: '+ serverPort);
});