'use strict'

var fs = require('fs'); // file system
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require("../models/artist");
var Album = require("../models/album");
var Song = require("../models/song");

function getSong(req, res){

	var songId = req.params.id;

	Song.findById(songId).populate({path:'album'}).exec((err, song) => {
		if (err) {
			res.status(500).send({message:"Error en la peticion"});
		}else{
			if (!song) {
				res.status(404).send({message:"La cancion no existe"});	
			}else{
				res.status(200).send({song:song});
			}
			
		}
	});
}

function getSongs(req, res){

	var albumId = req.params.album;

	if (!albumId) {
		var find = Song.find({}).sort('number');
	}else{
		var find = Song.find({album: albumId}).sort('number');
	}

	find.populate({path:'album', populate: { path: 'artist', model: 'Artist'} }).exec((err, songs) => {
		if (err) {
			res.status(500).send({message:"Error en la peticion"});
		}else{
			if (!songs) {
				res.status(404).send({message:"Las canciones no existen"});	
			}else{
				res.status(200).send({songs:songs});
			}
			
		}
	});

}

function saveSong(req, res){
	var song = new Song();

	var params = req.body;

	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = null;
	song.album = params.album;

	song.save((err, songStored) => {
		if(err){
			res.status(500).send({message:"Error al guardar la cancion"});
		}else{
			if(!songStored){
				res.status(404).send({message:"La cancion no ha sido guardada"});
			}else{
				res.status(200).send({song:songStored});
			}
		}
	})

}


function updateSong(req, res){
	var songId = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songId, update, (err, songUpdate) => {
		if(err){
			res.status(500).send({message:"Error al actualizar la cancion"});
		}else{
			if(!songUpdate){
				res.status(404).send({message:"La cancion no ha sido actualizado"});
			}else{
				res.status(200).send({song:songUpdate});
			}
		}
	});
}


function deleteSong(req, res){
	var songId = req.params.id;

	Song.findByIdAndRemove(songId, (err, songRemoved) => {
		if(err){
			res.status(500).send({message:"Error al eliminar la cancion"});
		}else{
			if(!songRemoved){
				res.status(404).send({message:"La cancion no fue eliminada"});
			}else{
				res.status(200).send({songRemoved:songRemoved});
			}
		}
	});
}


function uploadFile(req, res){
	var songId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){

		var file_path = req.files.file.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];

		if( file_ext == 'mp3' || file_ext == 'ogg' ){
			Song.findByIdAndUpdate(songId, {file: file_name},(err, songUpdate) => {
				if(!songUpdate){
					res.status(404).send({message:'No se ha podido actualizar la cancion...'});
				}else{
					res.status(200).send({song: songUpdate});
				}
			});
		}else{
			res.status(200).send({message:"Extension de archivo no valida..."});
		}

	}else{
		res.status(200).send({message:"No se subio ninguna imagen..."});
	}
}

function getFile(req, res){
	var file = req.params.songFile;
	var path_file = './uploads/songs/'+file;
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message:"No existe el audio..."});
		}
	})
}


module.exports = {
	getSong,
	saveSong,
	getSongs,
	updateSong,
	deleteSong,
	uploadFile,
	getFile
}