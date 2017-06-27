'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	name: String,
	usrname: String,
	email: String,
	password: String,
	role: String,
	image: String
}, { collection: 'users' })

module.exports = mongoose.model('User', UserSchema);