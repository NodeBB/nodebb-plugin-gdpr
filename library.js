'use strict';

var async = require('async');

var db = require.main.require('./src/database');
var meta = require.main.require('./src/meta');
var user = require.main.require('./src/user');
var pagination = require.main.require('./src/pagination');

var winston = require.main.require('winston');

var controllers = require('./lib/controllers');

var plugin = {};

plugin.init = function (params, callback) {
	var router = params.router;
	var hostMiddleware = params.middleware;
	var hostControllers = params.controllers;

	var SocketPlugins = require.main.require('./src/socket.io/plugins');

	SocketPlugins.gdpr = {};
	SocketPlugins.gdpr.refresh = function (socket, data, callback) {
		db.getObjectField('user:' + socket.uid, 'gdpr_consent', callback);
	};

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

plugin.getUsers = function (page, callback) {
	page = parseInt(page, 10) || 1;
	const resultsPerPage = 20;
	const start = Math.max(0, page - 1) * resultsPerPage;
	const stop = start + resultsPerPage - 1;
	let count;
	let pageCount;

	async.waterfall([
		function (next) {
			db.sortedSetCard('users:joindate', function (err, numUsers) {
				count = numUsers;
				pageCount = Math.ceil(count / resultsPerPage);
				next(err);
			});
		},
		async.apply(db.getSortedSetRange.bind(db), 'users:joindate', start, stop),
		function (uids, next) {
			db.getObjectsFields(uids.map(uid => 'user:' + uid), ['uid', 'gdpr_consent'], next);
		},
		function (users, next) {
			const uids = users.map(user => parseInt(user.uid, 10));

			user.getUsersFields(uids, ['username', 'userslug', 'picture'], function (err, profiles) {
				next(err, users, profiles);
			});
		},
	], function (err, users, profiles) {
		if (err) {
			return callback(err);
		}

		users = users.map((user, idx) => {
			user.gdpr_consent = parseInt(user.gdpr_consent, 10) === 1;
			return Object.assign(user, profiles[idx]);
		});

		callback(null, {
			users: users,
			pagination: pagination.create(page, pageCount),
		});
	});
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
			given: !!parseInt(consented, 10),
		};

		callback(null, config);
	});
};

module.exports = plugin;
