/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

define([
  'cocktail',
  'lib/promise',
  'views/base',
  'views/form',
  'views/sign_in',
  'stache!templates/openid',
  'lib/session',
  'lib/auth-errors'
],
function (Cocktail, p, BaseView, FormView, SignInView,
    Template, Session, AuthErrors) {

  var View = SignInView.extend({
    template: Template,
    className: 'sign-in',

    initialize: function (options) {
      options = options || {};
      var uid = /uid=([a-fA-F0-9]{32})/.exec(window.location.search)[1]
      var sessionToken = /session=([a-fA-F0-9]{64})/.exec(window.location.search)[1]
      this._formPrefill = options.formPrefill;
      Session.clear();
      this.user.clearSignedInAccount();
      var account = this.user.initAccount({
        uid: uid,
        sessionToken: sessionToken
      })
      var self = this
      account.signIn()
        .then(
          function () {
            return self.user.setSignedInAccount(account)
          }
        )
        .then(
          function () {
            self.onSignInSuccess(account)
          }
        )
    },

    context: function () {
      return {};
    }
  });

  Cocktail.mixin(
    View
  );

  return View;
});
