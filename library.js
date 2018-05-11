'use strict';

var async = require('async');

var db = module.parent.require('./database');
var meta = module.parent.require('./meta');
var user = module.parent.require('./user');
var batch = module.parent.require('./batch');

var winston = module.parent.require('winston');

var controllers = require('./lib/controllers');

var plugin = {};

plugin.init = function (params, callback) {
	var router = params.router;
	var hostMiddleware = params.middleware;
	var hostControllers = params.controllers;

	router.get('/admin/plugins/gdpr', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/gdpr', controllers.renderAdminPage);

	plugin.syncSettings(callback);
};

plugin.syncSettings = function (callback) {
	meta.settings.get('gdpr', function (err, settings) {
		if (err) {
			return callback(err);
		}

		plugin.settings = Object.assign((plugin.settings || {}), settings);
		callback();
	});
};

plugin.onSettingsChange = function (data) {
	if (data.plugin === 'gdpr') {
		plugin.settings = Object.assign((plugin.settings || {}), data.settings);
	}
};

plugin.getNonconsentedUsers = function (callback) {
	async.waterfall([
		function (next) {
			let payload = [];
			batch.processSortedSet('users:joindate', function (uids, next) {
				db.getObjectsFields(uids.map(uid => 'user:' + uid), ['uid', 'gdpr_consent'], function (err, users) {
					if (err) {
						return next(err);
					}

					payload = payload.concat(users);
					next();
				});
			}, {}, function (err) {
				if (err) {
					return next(err);
				}

				next(null, payload);
			});
		},
		function (users, next) {
			const uids = users.filter(user => parseInt(user.gdpr_consent, 10) !== 1).map(user => parseInt(user.uid, 10));

			user.getUsersFields(uids, ['username', 'userslug', 'picture'], next);
		},
	], callback);
};

plugin.addAdminNavigation = function (header, callback) {
	header.plugins.push({
		route: '/plugins/gdpr',
		icon: 'fa-eur',
		name: 'GDPR',
	});

	callback(null, header);
};

plugin.appendConfig = function (config, callback) {
	db.getObjectField('user:' + config.uid, 'gdpr_consent', function (err, consented) {
		if (err) {
			winston.error('[plugin/gdpr] Could not append info to uid  ' + config.uid + ': ' + err.message);
			return setImmediate(callback, null, config);
		}

		config.gdpr = {
			require: !!(plugin.settings.require_consent === 'on'),
			given: !!consented,
		};

		callback(null, config);
	});
};

module.exports = plugin;
