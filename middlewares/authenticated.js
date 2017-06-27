'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = '#cu450m34n';

exports.ensureAuth = function(req, res, next){
	if(!req.headers.authorization){
		return res.status(403).send({mensaje:'La petición no tiene la cabecera de autenticación.'});
	}

	var token = req.headers.authorization.replace(/['"]+/g,'');

	try{
		var payload = jwt.decode(token, secret);

		if( payload.exp <= moment().unix() ){
			return res.status(401).send({mensaje:'Token expirado.'});
		}
	}catch(ex){
		console.log(ex);
		return res.status(404).send({mensaje:'token no valido.'});
	}

	req.user = payload;

	next();
};