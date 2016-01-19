/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * A variant of the FxSync broker that speaks "v3" of the protocol.
 *
 * Enable syncPreferencesNotification on the verification complete screen.
 */

define(function (require, exports, module) {
  'use strict';

  var _ = require('underscore');
  var AuthErrors = require('lib/auth-errors');
  var FxDesktopV2AuthenticationBroker = require('./fx-desktop-v2');
  var NullBehavior = require('views/behaviors/null');

  var proto = FxDesktopV2AuthenticationBroker.prototype;

  var FxDesktopV3AuthenticationBroker = FxDesktopV2AuthenticationBroker.extend({
    defaultCapabilities: _.extend({}, proto.defaultCapabilities, {
      forceAuthAllowUidChange: true,
      syncPreferencesNotification: true
    }),

    type: 'fx-desktop-v3',

    afterForceAuthError: function (account, error) {
      // The default behavior is to halt before the signup confirmation
      // poll because about:accounts takes care of polling and updating the UI.
      // /force_auth is not opened in about:accounts and unless
      // beforeSignUpConfirmationPoll is overridden, the user receives no
      // visual feedback in this tab once the verification is complete.
      if (AuthErrors.is(error, 'DELETED_ACCOUNT')) {
        this.setBehavior('beforeSignUpConfirmationPoll', new NullBehavior());
      }

      return proto.afterForceAuthError.call(this, account, error);
    }
  });

  module.exports = FxDesktopV3AuthenticationBroker;
});

