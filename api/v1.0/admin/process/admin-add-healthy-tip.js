
"use strict";

const config = require('../../../../config');
const async = require('async');
const cloudinary = require('cloudinary');

const HealthyTips = require('../../model/healthy-tips');

module.exports = function(req, res) {

	cloudinary.config({
		cloud_name: config.CDN['NAME'],
		api_key: config.CDN['API_KEY'],
		api_secret: config.CDN['API_SECRET']
	});

	let imageUrl = '';
	let error = [];

	let title = req.body['title'];
	let description = req.body['description'];

	let image = req.files['image'];

	if (config.isEmpty(title)) {
		error.push(config.getErrorResponse('101A001', req));
	}
	if (config.isEmpty(description)) {
		error.push(config.getErrorResponse('101A002', req));
	}

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		adminAddHealthyTip();
	}

	function adminAddHealthyTip() {
		async.series(
			[
				function(callback) {
					if (typeof image !== 'undefined') {
						let tmpPath = image.path;
						let indexOfSeparator = tmpPath.lastIndexOf("/");
						if (indexOfSeparator <= 0) {
							indexOfSeparator = tmpPath.lastIndexOf("\\");
						}
						let indexOfDot = tmpPath.lastIndexOf(".");
						if (indexOfDot <= 0) {
							indexOfDot = tmpPath.length;
						}
						let filename = tmpPath.substring(indexOfSeparator + 1, tmpPath.length - (tmpPath.length - indexOfDot));
						cloudinary.v2.uploader.upload(tmpPath, { public_id: config.GLOBAL['APP_NAME'].toLowerCase() + '/healthy-tips/' + filename }, function(err, result) {
							if (err) {
								error.push(config.getErrorResponse('101Z012', req));
								let resp = config.getResponse(res, 500, error, {}, err);
								config.logApiCall(req, res, resp);
								return callback(true);
							}
							imageUrl = result['secure_url'];
							return callback(null);
						});
					} else {
						return callback(null);
					}
				},
				function(callback) {
					let insertData = {
						'title': title,
						'description': description,
						'image': imageUrl,
					};
					insertData = config.appendUpdatedDate(insertData);
					HealthyTips.create(insertData, function (err, result) {
						if (err) {
							error.push(config.getErrorResponse('101Z012', req));
							let resp = config.getResponse(res, 500, error, {}, err);
							config.logApiCall(req, res, resp);
							return callback(true);
						}
						let resp = config.getResponse(res, 100, error, { 'healthy_tip_info': config.getHealthyTipsInfo(result) });
						config.logApiCall(req, res, resp);
						return callback(null);
					});
				}
			]
		);
	}
};
