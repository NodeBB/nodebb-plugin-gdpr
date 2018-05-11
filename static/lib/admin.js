'use strict';

/* globals $, app, socket, define */

define('admin/plugins/gdpr', ['settings', 'autocomplete'], function (Settings, autocomplete) {
	var ACP = {};

	ACP.init = function () {
		Settings.load('gdpr', $('.gdpr-settings'));

		$('#save').on('click', function () {
			Settings.save('gdpr', $('.gdpr-settings'), function () {
				app.alert({
					type: 'success',
					alert_id: 'gdpr-saved',
					title: 'Settings Saved',
				});
			});
		});

		autocomplete.user($('#user-search'), function (ev, ui) {
			socket.emit('user.gdpr.check', { uid: ui.item.user.uid }, function (err, consented) {
				if (err) {
					app.alertError(err.message);
				}

				ui.item.user.consented = !!parseInt(consented, 10);
				app.parseAndTranslate('admin/plugins/gdpr', 'check', {
					check: [ui.item.user],
				}, function (html) {
					$('.consent-check').html(html);
				});
			});
		});
	};

	return ACP;
});
