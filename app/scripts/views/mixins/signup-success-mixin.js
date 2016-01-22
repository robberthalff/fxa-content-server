/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// `onSignUpSuccess` is shared amongst several views. This is the shared source.

define(function (require, exports, module) {
  'use strict';

  var t = require('views/base').t;
  var Constants = require('lib/constants');

  module.exports = {
    onSignUpSuccess: function (account) {
      var self = this;
      if (account.get('verified')) {
        if (self.relier.get('preVerifyToken')) {
          // User was pre-verified, notify the broker.
          return self.invokeBrokerMethod('afterSignIn', account)
            .then(function () {
              self.navigate('signup_complete');
            });
        }

        // Account already existed. There was no need to create it,
        // so we just signed the user in instead.
        // https://github.com/mozilla/fxa-content-server/issues/2778
        return self.navigate('settings', {
          // TODO: Run this past rfeeley, do we want to show the user a message?
          success: t(Constants.SIGN_UP_EXISTING_USER_SUCCESS)
        });
      } else {
        self.navigate('confirm', {
          account: account
        });
      }
    }
  };
});
