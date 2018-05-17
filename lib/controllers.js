'use strict';


var Controllers = {};

Controllers.renderAdminPage = function (req, res) {
	var plugin = module.parent.exports;

	plugin.getUsers(req.query.page || 1, function (err, data) {
		res.render('admin/plugins/gdpr', {
			err: err ? err.message : null,
			users: data.users || [],
			pagination: data.pagination,
		});
	});
};

module.exports = Controllers;
