/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'intern!object',
  'intern/chai!assert',
  'tests/lib/helpers',
  'tests/functional/lib/helpers'
], function (registerSuite, assert, TestHelpers, FunctionalHelpers) {
  var PASSWORD = 'password';
  var email;

  var openForceAuth = FunctionalHelpers.openForceAuth;

  var fillOutForceAuth = FunctionalHelpers.thenify(FunctionalHelpers.fillOutForceAuth);
  var clearBrowserState = FunctionalHelpers.thenify(FunctionalHelpers.clearBrowserState);

  function testAccountNoLongerExistsErrorShown(context) {
    return function () {
      return context.remote.findByCssSelector('.error')
        .getVisibleText()
        .then(function (resultText) {
          assert.include(resultText.toLowerCase(), 'no longer exists');
        })
      .end();
    };
  }

  registerSuite({
    name: 'force_auth with a registered email',

    beforeEach: function () {
      email = TestHelpers.createEmail();
      var self = this;
      return FunctionalHelpers.createUser(self, email, PASSWORD, { preVerified: true })
        .then(clearBrowserState(self));
    },

    'sign in via force_auth': function () {
      var self = this;
      return openForceAuth(self, email)

        .then(fillOutForceAuth(self, PASSWORD))

        .findById('fxa-settings-header')
        .end();
    },

    'forgot password flow via force-auth goes directly to confirm email screen': function () {
      var self = this;
      return openForceAuth(self, email)
        .findByCssSelector('.reset-password')
          .click()
        .end()

        .findById('fxa-confirm-reset-password-header')
        .end()

        // user remembers her password, clicks the "sign in" link. They
        // should go back to the /force_auth screen.
        .findByClassName('sign-in')
          .click()
        .end()

        .findById('fxa-force-auth-header');
    },

    'visiting the tos/pp links saves information for return': function () {
      var self = this;
      return testRepopulateFields.call(self, '/legal/terms', 'fxa-tos-header')
        .then(function () {
          return testRepopulateFields.call(self, '/legal/privacy', 'fxa-pp-header');
        });
    },

    'form prefill information is cleared after sign in->sign out': function () {
      var self = this;
      return openForceAuth(self, email)

        .then(fillOutForceAuth(self, PASSWORD))

        .findById('fxa-settings-header')
        .end()

        .findByCssSelector('#signout')
          .click()
        .end()

        .findByCssSelector('#fxa-signin-header')
        .end()

        .findByCssSelector('input[type=password]')
          .getProperty('value')
          .then(function (resultText) {
            // check the password address was cleared
            assert.equal(resultText, '');
          })
        .end();
    }
  });

  registerSuite({
    name: 'force_auth with an unregistered email',

    beforeEach: function () {
      email = TestHelpers.createEmail();
      // clear localStorage to avoid polluting other tests.
      return FunctionalHelpers.clearBrowserState(this);
    },

    'sign in shows an error message': function () {
      var self = this;
      return openForceAuth(self, email)

        .then(fillOutForceAuth(self, PASSWORD))

        .then(testAccountNoLongerExistsErrorShown(self));
    },

    'reset password shows an error message': function () {
      var self = this;
      return openForceAuth(self, email)
        .findByCssSelector('a[href="/confirm_reset_password"]')
          .click()
        .end()

        .then(testAccountNoLongerExistsErrorShown(self));
    }
  });

  registerSuite({
    name: 'force_auth with an unregistered uid',

    beforeEach: function () {
      email = TestHelpers.createEmail();
      // clear localStorage to avoid polluting other tests.
      return FunctionalHelpers.clearBrowserState(this);
    },

    'shows `account deleted` message immediately, no additional UI visible': function () {
      var self = this;
      return openForceAuth(self, email, { uid: TestHelpers.createUID() })

        .then(testAccountNoLongerExistsErrorShown(self))

        .then(FunctionalHelpers.noSuchElement(self, 'a[href="/confirm_reset_password"]'));
    }
  });


  function testRepopulateFields(dest, header) {
    var self = this;

    return openForceAuth(self, email)

      .findByCssSelector('input[type=password]')
        .clearValue()
        .click()
        .type(PASSWORD)
      .end()

      .findByCssSelector('a[href="' + dest + '"]')
        .click()
      .end()

      .findById(header)
      .end()

      .findByCssSelector('.back')
        .click()
      .end()

      .findById('fxa-force-auth-header')
      .end()

      .findByCssSelector('input[type=password]')
        .getProperty('value')
        .then(function (resultText) {
          // check the email address was re-populated
          assert.equal(resultText, PASSWORD);
        })
      .end();
  }
});
