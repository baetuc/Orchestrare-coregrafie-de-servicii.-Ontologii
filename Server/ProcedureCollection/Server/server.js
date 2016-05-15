/* DEPENDENTE */
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var async = require("async");
var routes = require('./routes');
var path = require('path');
var timeout = require('connect-timeout');
var cons = require('consolidate');
function haltOnTimedout(req, res, next){
	if (!req.timedout) next();
}

//Incepem.
var app=express();
app.engine('html',cons.swig); //N-o sa folosim probabil
app.set('view engine','html'); //La fel.
app.set('views',__dirname + '/views'); //La fel, asta e pentru fisiere HTML, dar lasam aici poate o sa trb candva
app.use(timeout('15s')); //marim timeout
app.use(cookieParser()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true                    //Pentru parsat cookie si alte chestii de input
}));
app.use(express.static(path.join(__dirname, 'public'))); //Unneeded, pentru front-end
app.use(haltOnTimedout); //timeout = fail
routes(app); //fisierul routes, se face ce e acolo
app.listen(80); //listen la 80
console.info("Listening at 80")