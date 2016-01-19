/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'intern!object',
  'intern/chai!assert',
  'tests/lib/helpers',
  'tests/functional/lib/helpers'
], function (registerSuite, assert, TestHelpers, FunctionalHelpers) {
  var email;
  var PASSWORD = '12345678';

  var createUser = FunctionalHelpers.createUser;
  var fillOutSignUp = FunctionalHelpers.thenify(FunctionalHelpers.fillOutSignUp);
  var fillOutForceAuth = FunctionalHelpers.thenify(FunctionalHelpers.fillOutForceAuth);
  var noSuchBrowserNotification = FunctionalHelpers.noSuchBrowserNotification;
  var openForceAuth = FunctionalHelpers.thenify(FunctionalHelpers.openForceAuth);
  var respondToWebChannelMessage = FunctionalHelpers.respondToWebChannelMessage;
  var testIsBrowserNotified = FunctionalHelpers.testIsBrowserNotified;
  var noSuchErrorWasShown = FunctionalHelpers.noSuchErrorWasShown;

  registerSuite({
    name: 'Firefox Desktop Sync v3 force_auth',

    beforeEach: function () {
      email = TestHelpers.createEmail();

      return FunctionalHelpers.clearBrowserState(this);
    },

    'with a registered email': function () {
      var self = this;

      return createUser(this, email, PASSWORD, { preVerified: true })
        .then(openForceAuth(self, email, { context: 'fx_desktop_v3', service: 'sync' }))

        .then(noSuchBrowserNotification(self, 'fxaccounts:logout'))

        .then(respondToWebChannelMessage(self, 'fxaccounts:can_link_account', { ok: true } ))

        .then(fillOutForceAuth(self, PASSWORD))

        // add a slight delay to ensure the page does not transition
        .sleep(2000)

        // the page does not transition.
        .findByCssSelector('#fxa-force-auth-header')
        .end()

        .then(testIsBrowserNotified(self, 'fxaccounts:can_link_account'))
        .then(testIsBrowserNotified(self, 'fxaccounts:login'));
    },

    'with an unregistered email': function () {
      var self = this;

      return this.remote
        .then(openForceAuth(self, email, { context: 'fx_desktop_v3', service: 'sync' }))
        .then(noSuchBrowserNotification(self, 'fxaccounts:logout'))

        .then(respondToWebChannelMessage(self, 'fxaccounts:can_link_account', { ok: true } ))

        .then(fillOutForceAuth(self, PASSWORD))

        // redirect the user to the signup page where they can sign up
        // with the specified email
        .findByCssSelector('#fxa-signup-header')
        .end()

        .findByCssSelector('form input[type=email]')
          .getAttribute('value')
          .then(function (resultText) {
            assert.equal(resultText.trim(), email);
          })
        .end()

        .then(fillOutSignUp(self, email, PASSWORD, { enterEmail: false }))

        // the default behavior of not transitioning should be overridden.
        /*.findByCssSelector('#fxa-confirm-header')*/
        /*.end()*/


        .then(testIsBrowserNotified(self, 'fxaccounts:can_link_account'));
      /*.then(testIsBrowserNotified(self, 'fxaccounts:login'));*/
    },

    'with a registered email and an old uid': function () {
      var self = this;
      return createUser(this, email, PASSWORD, { preVerified: true })
        .then(openForceAuth(self, email, {
          context: 'fx_desktop_v3',
          service: 'sync',
          uid: TestHelpers.createUID()
        }))
        .then(respondToWebChannelMessage(self, 'fxaccounts:can_link_account', { ok: true } ))
        .then(noSuchErrorWasShown(self))

        .then(fillOutForceAuth(self, PASSWORD))

        // user is able to sign in, browser notified of new uid
        .then(testIsBrowserNotified(self, 'fxaccounts:can_link_account'))
        .then(testIsBrowserNotified(self, 'fxaccounts:login'));
    }
  });
});
