'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = '#cu450m34n';

exports.createToken = function(user){
	var payload = {
		sub: user._id,
		name: user.name,
		usrname: user.usrname,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(),
		exp: moment().add(1,'days').unix
	};

	return jwt.encode(payload, secret);
};