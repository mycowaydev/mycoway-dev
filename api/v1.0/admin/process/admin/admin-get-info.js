
"use strict";
const config = require('../../../../../config');
const Admin = require('../../../model/admin');

module.exports = function (req, res) {
	
	let data = getParam(req);
	let error = validateParam(req, data);

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		getAdminInfo(req, res, error, data);
	}
}

function getParam(req) {
	var data = {};
	data.id = req.body['id'] || '';
	data.admin_user_id = req.body['admin_user_id'] || '';

	return data;
}

function validateParam(req, data) {
	let error = [];

	if (config.isEmpty(data.id) && config.isEmpty(data.admin_user_id)) {
		error.push(config.getErrorResponse('101A008', req));
	}

	return error;
}

function getQuery(data) {
	let query;
	if (data.id) {
		query = { '_id': data.id };
	} else if (data.admin_user_id) {
		query = { 'admin_user_id': data.admin_user_id };
	}

	return query;
}

function getAdminInfo(req, res, error, data) {
	Admin.findOne(getQuery(data), function (err, result) {
		if (err) {
			error.push(config.getErrorResponse('101Z012', req));
			let resp = config.getResponse(res, 500, error, {}, err);
			config.logApiCall(req, res, resp);
			return;
		}
		let resp = config.getResponse(res, 100, error, result);
		config.logApiCall(req, res, resp);
		return;
	});
}