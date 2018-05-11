'use strict';

/* globals window, document, config, $, bootbox, ajaxify, app */

$(document).ready(function () {
	var gdpr = {};

	gdpr.check = function () {
		if (!config || !config.gdpr) {
			return setTimeout(gdpr.check, 500);
		}

		if (config.gdpr.require && !config.gdpr.given && ajaxify.currentPage !== 'user/' + app.user.userslug + '/consent') {
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

	$(window).on('action:ajaxify.end', gdpr.check);
});
