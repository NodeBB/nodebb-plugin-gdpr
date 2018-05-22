'use strict';

/* globals window, document, config, $, bootbox, ajaxify, app, socket */

$(document).ready(function () {
	var gdpr = {};

	gdpr.check = function (evt, data) {
		if (!config || !config.gdpr) {
			return setTimeout(gdpr.check, 500);
		} else if (data.tpl_url === 'account/consent') {
			return gdpr.refresh();
		}

		if (app.user.uid && config.gdpr.require && !config.gdpr.given) {
			bootbox.alert({
				title: '[[user:consent.lead]]',
				message: '[[user:consent.not_received]]',
				closeButton: false,
				onEscape: false,
				buttons: {
					ok: {
						label: '&rarr; [[user:consent.title]]',
						classname: 'btn-primary',
					},
				},
				callback: function () {
					ajaxify.go('/me/consent');
				},
			});
		}
	};

	gdpr.refresh = function () {
		socket.emit('plugins.gdpr.refresh', {}, function (err, given) {
			if (err) {
				app.alertError(err.message);
			}

			config.gdpr.given = parseInt(given, 10) === 1;
		});
	};

	$(window).on('action:ajaxify.end', gdpr.check);
});
