'use strict'

var fs = require('fs'); // file system
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require("../models/artist");
var Album = require("../models/album");
var Song = require("../models/song");

function getArtist(req, res){
	var artist = new Artist();

	var artistId = req.params.id;

	Artist.findById(artistId, (err, artistStored) => {
		if (err) {
			res.status(500).send({message:"Error al obtener el artista"});
		}else{
			if (!artistStored) {
				res.status(404).send({message:"El artista no existe"});	
			}else{
				res.status(200).send({artist:artistStored});
			}
			
		}
	});
}

function getArtists(req, res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}
	
	var itemsPerPage = 4;

	Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artistStored, total){
		if (err) {
			res.status(500).send({message:"Error en la peticion"});
		}else{
			if (!artistStored) {
				res.status(404).send({message:"No hay artistas"});	
			}else{
				return res.status(200).send({
					total_items: total,
					artists: artistStored
				});
			}
		}
	});

}

function saveArtist(req, res){
	var artist = new Artist();

	var params = req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';

	artist.save((err, artistStored) => {
		if(err){
			res.status(500).send({message:"Error al guardar el artista"});
		}else{
			if(!artistStored){
				res.status(404).send({message:"El artista no ha sido guardado"});
			}else{
				res.status(200).send({artist:artistStored});
			}
		}
	})

}

function updateArtist(req, res){
	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdate) => {
		if(err){
			res.status(500).send({message:"Error al actualizar el artista"});
		}else{
			if(!artistUpdate){
				res.status(404).send({message:"El artista no ha sido actualizado"});
			}else{
				res.status(200).send({artist:artistUpdate});
			}
		}
	});
}

function deleteArtist(req, res){
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if(err){
			res.status(500).send({message:"Error al eliminar el artista"});
		}else{
			if(!artistRemoved){
				res.status(404).send({message:"El artista no ha sido eliminado"});
			}else{
				

				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
					if(err){
						res.status(500).send({message:"Error al eliminar los albums"});
					}else{
						if(!albumRemoved){
							res.status(404).send({message:"Los albums no fueron eliminados"});
						}else{
							


							Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
								if(err){
									res.status(500).send({message:"Error al eliminar la canción"});
								}else{
									if(!songRemoved){
										res.status(404).send({message:"Las camciones no fueron eliminadas"});
									}else{
										res.status(200).send({artist:artistRemoved});
									}
								}
							});



						}
					}
				});



			}
		}
	});
}

function uploadImage(req, res){
	var artistId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){

		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];

		if( file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' ){
			Artist.findByIdAndUpdate(artistId, {image: file_name},(err, artistUpdate) => {
				if(!artistUpdate){
					res.status(404).send({message:'No se ha podido actualizar el artista...'});
				}else{
					res.status(200).send({artist: artistUpdate});
				}
			});
		}else{
			res.status(200).send({message:"Extension de archivo no valida..."});
		}

	}else{
		res.status(200).send({message:"No se subio ninguna imagen..."});
	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/artists/'+imageFile;
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message:"No existe la imagen..."});
		}
	})
}

module.exports = {
	getArtist,
	getArtists,
	saveArtist,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
};