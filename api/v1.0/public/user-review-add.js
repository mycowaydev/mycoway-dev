
"use strict";

const config = require('../../../config');
const async = require('async');
const Review = require('../model/review');

module.exports = function (req, res) {

	let data = getParam(req);
	let error = validateParam(req, data);

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		action(req, res, error, data);
	}
}

function getParam(req) {
	var data = {};
	data.admin_user_id = req.session.adminUserid;
	data.name = req.body['name'];
	data.status = req.body['status'];
	data.email_address = req.body['email_address'];
	data.rate = req.body['rate'];
	data.desc = req.body['desc'];
	data.image = [];
	data.remarks = req.body['remarks'];
	data.review_date = config.getCurrentTimestamp();

	return data;
}

function validateParam(req, data) {
	let error = [];

	if (config.isEmpty(data.name)) {
		error.push(config.getErrorResponse('102A001', req));
	}
	if (config.isEmpty(data.status)) {
		error.push(config.getErrorResponse('102A002', req));
	}
	if (config.isEmpty(data.rate)) {
		error.push(config.getErrorResponse('102A003', req));
	}

	return error;
}

function action(req, res, error, data) {
	async.series(
		[
			function (callback) {
				let insertData = config.appendCommonFields(data, 'REVIEW_ADD', 'user', true);
				Review.create(insertData, function (err, result) {
					if (err) {
						error.push(config.getErrorResponse('101Z012', req));
						let resp = config.getResponse(res, 500, error, {}, err);
						config.logApiCall(req, res, resp);
						return callback(true);
					}
					let resp = config.getResponse(res, 100, error, {});
					config.logApiCall(req, res, resp);
					return callback(null);
				});
			}
		]
	);
}
