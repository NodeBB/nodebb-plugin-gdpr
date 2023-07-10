<div class="acp-page-container">
	<!-- IMPORT admin/partials/settings/header.tpl -->

	<div class="row m-0">
		<div id="spy-container" class="col-12 col-md-8 px-0 mb-4" tabindex="0">
			<form role="form" class="gdpr-settings">
				<div class="mb-4">
					<h5 class="fw-bold tracking-tight settings-header">General</h5>

					<p class="lead">
						This plugin allows you to administer the consent states for the users in your forum.
					</p>
					<p>
						It is primarily useful to those communities that have been active before the GDPR legislation
						came into effect, as the users in those communities must also give their consent for data processing.
						Unfortunately, there is no clause nor precedent for grandfathering or implied consent, so as a forum
						administrator, you must ensure that all of your users have consented in order for your forum to be
						considered compliant with GDPR.
					</p>
					<div class="form-check form-switch">
						<input class="form-check-input" type="checkbox" id="require_consent" name="require_consent">
						<label class="form-check-label">Require Consent for Existing Users</label>
						<p class="form-text">
							If enabled, any user logged in that does has not explicitly given consent will be redirected to the
							&quot;Your Rights &amp; Consent&quot; page so they can provide consent. They will be required to do
							so before they can interact with the forum.
						</p>
					</div>
				</div>

				<div class="mb-4">
					<h5 class="fw-bold tracking-tight settings-header">User Search</h5>

					<p>Check consent status for an individual user here.</p>

					<div class="form-group">
						<label for="user-search">[[users:search]]</label>
						<input class="form-control" type="text" id="user-search" placeholder="[[users:enter_username]]" />
						<div class="consent-check">
							{{{ if check }}}
							{{{ each check }}}
							<hr />
							<div class="row">
								<div class="col-3">
									<a target="_blank" href="{config.relative_path}/uid/{../uid}">
										{buildAvatar(check, "64px", false)}
									</a>
								</div>
								<div class="col-9">
									<p>
										<strong>Username:</strong> {../username}<br />
										<strong>Consented:</strong>
										<!-- IF ../consented -->
										<span class="label label-success"><i class="fa fa-check"></i></span>
										<!-- ELSE -->
										<span class="label label-danger"><i class="fa fa-times"></i></span>
										<!-- END -->
									</p>
								</div>
							</div>
							{{{ end }}}
							{{{ end }}}
						</div>
					</div>
				</div>

				<div class="mb-4">
					<h5 class="fw-bold tracking-tight settings-header">Users</h5>

					<table class="table small">
						<thead>
							<tr>
								<th colspan="2">User</th>
								<th>Consented</th>
							</tr>
						</thead>
						<tbody>
							<!-- BEGIN users -->
							<tr>
								<td>
									{buildAvatar(users, "24px", false)}
								</td>
								<td>
									{../username}
								</td>
								<td>
									<!-- IF ../gdpr_consent -->
									<span class="label label-success"><i class="fa fa-check"></i></span>
									<!-- ELSE -->
									<span class="label label-danger"><i class="fa fa-times"></i></span>
									<!-- END -->
								</td>
							</tr>
							<!-- END -->
						</tbody>
					</table>

					<!-- IMPORT partials/paginator.tpl -->
				</div>
			</form>
		</div>
	</div>
</div>