/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(function (require, exports, module) {
  'use strict';

  var allowOnlyOneSubmit = require('views/decorators/allow_only_one_submit');
  var AuthErrors = require('lib/auth-errors');
  var BaseView = require('views/base');
  var Cocktail = require('cocktail');
  var FormView = require('views/form');
  var PasswordResetMixin = require('views/mixins/password-reset-mixin');
  var SignInView = require('views/sign_in');
  var Template = require('stache!templates/force_auth');

  function getFatalErrorMessage(self, fatalError) {
    if (fatalError) {
      return self.translateError(fatalError);
    }

    return '';
  }

  var proto = SignInView.prototype;

  var View = SignInView.extend({
    template: Template,
    className: 'force-auth',

    _fatalError: null,

    beforeRender: function () {
      var relier = this.relier;

      if (! relier.has('email')) {
        this._fatalError = AuthErrors.toError('FORCE_AUTH_EMAIL_REQUIRED');
        return;
      }

      /**
       * If the relier specifies a UID, check whether the UID is still
       * registered. If the uid is no longer registered, notify the
       * broker that the account has been deleted. The user will
       * still be allowed to sign in with their email address. If
       * no account is registered with the given email address,
       * the broker will decide whether to allow the user to sign up.
       */
      if (relier.has('uid')) {
        var account = this.user.initAccount({
          email: relier.get('email'),
          uid: relier.get('uid')
        });

        var self = this;
        return this.user.checkAccountExists(account)
          .then(function (exists) {
            if (! exists &&
                ! self.broker.hasCapability('forceAuthAllowUidChange')) {
              // Unless the broker allows a UID change, dead end.
              self._fatalError = AuthErrors.toError('DELETED_ACCOUNT');
            }
          });
      }
    },

    context: function () {
      return {
        email: this.relier.get('email'),
        fatalError: getFatalErrorMessage(this, this._fatalError),
        isPasswordAutoCompleteDisabled: this.isPasswordAutoCompleteDisabled(),
        password: this._formPrefill.get('password')
      };
    },

    events: {
      'click a[href="/confirm_reset_password"]': BaseView.cancelEventThen('resetPasswordNow')
    },

    beforeDestroy: function () {
      this._formPrefill.set('password', this.getElementValue('.password'));
    },

    onSignInError: function (account, password, error) {
      var self = this;
      if (AuthErrors.is(error, 'UNKNOWN_ACCOUNT')) {
        error = AuthErrors.toError('DELETED_ACCOUNT');
      }

      return self.invokeBrokerMethod('afterForceAuthError', account, error)
        .then(function () {
          return proto.onSignInError.call(self, account, password, error);
        });
    },

    onSignInSuccess: function (account) {
      var self = this;
      self.logViewEvent('success');

      // The account's uid may have changed, update the relier just in case.
      // If the relier does not support an account `uid` change, the
      // flow would have stopped in `beforeRender`.
      self.relier.set('uid', account.get('uid'));

      return self.invokeBrokerMethod('afterForceAuth', account)
        .then(function () {
          self.navigate(self.model.get('redirectTo') || 'settings', {}, {
            clearQueryParams: true
          });
        });
    },

    resetPasswordNow: allowOnlyOneSubmit(function () {
      var self = this;
      var email = self.relier.get('email');

      return self.resetPassword(email)
        .fail(function (error) {
          if (AuthErrors.is(error, 'UNKNOWN_ACCOUNT')) {
            error = AuthErrors.toError('DELETED_ACCOUNT');
          }

          self.displayError(error);
        });
    }),

    /**
     * Displays the account's avatar
     */
    afterVisible: function () {
      var email = this.relier.get('email');
      var account = this.user.getAccountByEmail(email);

      // Use FormView's afterVisible because SignIn attemps to
      // display a profile image for the "suggested" account.
      FormView.prototype.afterVisible.call(this);
      // Display the profile image if possible, otherwise show a placeholder.
      return this.displayAccountProfileImage(account, { spinner: true });
    }
  });

  Cocktail.mixin(
    View,
    PasswordResetMixin
  );

  module.exports = View;
});
