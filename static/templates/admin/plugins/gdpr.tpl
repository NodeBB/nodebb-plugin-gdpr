<form role="form" class="gdpr-settings">
	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">General</div>
		<div class="col-sm-10 col-xs-12">
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
			<div class="form-group">
				<div class="checkbox">
					<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
						<input class="mdl-switch__input" type="checkbox" id="require_consent" name="require_consent">
						<span class="mdl-switch__label">Require Consent for Existing Users</span>
					</label>
				</div>
				<p class="help-block">
					If enabled, any user logged in that does has not explicitly given consent will be redirected to the
					&quot;Your Rights &amp; Consent&quot; page so they can provide consent. They will be required to do
					so before they can interact with the forum.
				</p>
			</div>
		</div>
	</div>

	<hr />

	<div class="row">
		<div class="col-xs-12 col-sm-4">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3 class="panel-title">User Search</h3>
				</div>
				<div class="panel-body form">
					<p>Check consent status for an individual user here.</p>
					<div class="form-group">
						<label for="user-search">[[users:search]]</label>
						<input class="form-control" type="text" id="user-search" placeholder="[[users:enter_username]]" />
						<div class="consent-check">
							<!-- IF check -->
							<!-- BEGIN check -->
							<hr />
							<div class="row">
								<div class="col-xs-3">
									<a target="_blank" href="{config.relative_path}/uid/{../uid}">
										<!-- IF ../picture -->
										<img class="avatar avatar-lg" component="user/picture" src="{../picture}" itemprop="image" />
										<!-- ELSE -->
										<div class="avatar avatar-lg" component="user/picture" style="background-color: {../icon:bgColor};">{../icon:text}</div>
										<!-- END -->
									</a>
								</div>
								<div class="col-xs-9">
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
							<!-- END -->
							<!-- END -->
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="col-xs-12 col-sm-8">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3 class="panel-title">Users who have not provided consent</h3>
				</div>
				<div class="panel-body">
					<!-- BEGIN users -->
					<!-- IF ../picture -->
					<a href="{config.relative_path}/user/{../userslug}"><img class="avatar avatar-sm avatar-rounded" src="{../picture}" title="{../username}" /></a>
					<!-- ELSE -->
					<div class="avatar avatar-sm" style="background-color: {../icon:bgColor};" title="{../username}">{../icon:text}</div>
					<!-- ENDIF ../picture -->
					<!-- END -->
				</div>
			</div>
		</div>
	</div>
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>