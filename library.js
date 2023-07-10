'use strict';

var async = require('async');

var db = require.main.require('./src/database');
var meta = require.main.require('./src/meta');
var user = require.main.require('./src/user');
var pagination = require.main.require('./src/pagination');

var controllers = require('./lib/controllers');

const routeHelpers = require.main.require('./src/routes/helpers');

var plugin = {};

plugin.init = async ({ router }) => {
	var SocketPlugins = require.main.require('./src/socket.io/plugins');

	SocketPlugins.gdpr = {};
	SocketPlugins.gdpr.refresh = function (socket, data, callback) {
		db.getObjectField('user:' + socket.uid, 'gdpr_consent', callback);
	};

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/gdpr', controllers.renderAdminPage);
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

plugin.appendConfig = async (config) => {
	const consented = await db.getObjectField('user:' + config.uid, 'gdpr_consent');
	const { require_consent } = await meta.settings.get('gdpr');

	config.gdpr = {
		require: require_consent === 'on',
		given: !!parseInt(consented, 10),
	};

	return config;
};

module.exports = plugin;
