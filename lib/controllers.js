'use strict';


var Controllers = {};

Controllers.renderAdminPage = function (req, res, next) {
	var plugin = module.parent.exports;

	plugin.getNonconsentedUsers(function (err, users) {
		res.render('admin/plugins/gdpr', {
			err: err ? err.message : null,
			users: users || [],
		});
	});
};

module.exports = Controllers;
