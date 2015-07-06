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
    className: 'openid-sign-in',

    initialize: function (options) {
      SignInView.prototype.initialize.call(this, options);
      options = options || {};

      this._uid = this.relier.get('uid');
      this._sessionToken = this.relier.get('session');
      Session.clear();
      this.user.clearSignedInAccount();
    },

    beforeRender: function () {
      var self = this;
      var account = self.user.initAccount({
        uid: self._uid,
        sessionToken: self._sessionToken
      });

      return account.signIn()
        .then(function () {
          return self.user.setSignedInAccount(account);
        })
        .then(function () {
          self.onSignInSuccess(account);
        });
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
