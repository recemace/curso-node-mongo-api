'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema = Schema({
	name: String,
	description: String,
	image: String
}, { collection: 'artists' })

module.exports = mongoose.model('Artist', ArtistSchema);