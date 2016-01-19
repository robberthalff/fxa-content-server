/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(function (require, exports, module) {
  'use strict';

  var BackMixin = require('views/mixins/back-mixin');
  var CheckboxMixin = require('views/mixins/checkbox-mixin');
  var Cocktail = require('cocktail');
  var FormView = require('views/form');
  var p = require('lib/promise');
  var ServiceMixin = require('views/mixins/service-mixin');
  var SignupSuccessMixin = require('views/mixins/signup-success-mixin');
  var Template = require('stache!templates/permissions');

  var View = FormView.extend({
    template: Template,
    className: 'permissions',

    initialize: function (options) {
      // Account data is passed in from sign up and sign in flows.
      var data = this.ephemeralData();
      this._account = data && this.user.initAccount(data.account);

      this.type = options.type;
    },

    getAccount: function () {
      return this._account;
    },

    context: function () {
      var account = this.getAccount();
      return {
        displayName: account.get('displayName') || 'None set',
        email: account.get('email'),
        isDisplayNameRequested: this._isDisplayNameRequested(),
        isAvatarRequested: this._isAvatarRequested(),
        privacyUri: this.relier.get('privacyUri'),
        serviceName: this.relier.get('serviceName'),
        termsUri: this.relier.get('termsUri'),
        unsafeAvatar: encodeURI(account.get('profileImageUrl') || '')
      };
    },

    _isAvatarRequested: function () {
      var account = this.getAccount();
      return account.has('profileImageUrl');
    },

    _isDisplayNameRequested: function () {
      var account = this.getAccount();
      return account.has('displayName');
    },

    beforeRender: function () {
      // user cannot proceed if they have not initiated a sign up/in.
      var account = this.getAccount();
      if (! account.get('sessionToken')) {
        this.navigate(this._previousView());
        return false;
      } else {
        return account.fetchProfile();
      }
    },

    submit: function () {
      var self = this;
      var account = self.getAccount();

      self.logViewEvent('accept');

      return p().then(function () {
        account.saveGrantedPermissions(self.relier.get('clientId'), self.relier.get('permissions'));
        self.user.setAccount(account);

        if (self.is('sign_up')) {
          return self.onSignUpSuccess(account);
        } else if (account.get('verified')) {
          return self.onSignInSuccess(account);
        }
        return self.onSignInUnverified(account);
      });
    },

    onSignInSuccess: function (account) {
      var self = this;
      self.logViewEvent('success');
      return self.invokeBrokerMethod('afterSignIn', account)
        .then(function () {
          self.navigate('settings');
        });
    },

    onSignInUnverified: function (account) {
      this.navigate('confirm', {
        data: {
          account: account
        }
      });
    },

    _previousView: function () {
      var page = this.is('sign_up') ? '/signup' : '/signin';
      return this.broker.transformLink(page);
    },

    is: function (type) {
      return this.type === type;
    }
  });

  Cocktail.mixin(
    View,
    BackMixin,
    CheckboxMixin,
    ServiceMixin,
    SignupSuccessMixin
  );

  module.exports = View;
});
