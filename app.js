'use strict'

var express = require("express");
var bodyParser = require("body-parser");

var app = express();

// cargar rutas
var user_router = require('./routes/user');
var artist_router = require('./routes/artist');
var album_router = require('./routes/album');
var song_router = require('./routes/song');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// configurar cabeceras http
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');
	next();
});

// rutas base
app.use('/api', user_router);
app.use('/api', artist_router);
app.use('/api', album_router);
app.use('/api', song_router);
/*
app.get('/pruebas', function(req, res){
	res.status(200).send({message:"Welcome"})
});
*/

module.exports = app;