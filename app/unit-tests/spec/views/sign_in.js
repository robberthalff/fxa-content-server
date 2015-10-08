/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'chai',
  'sinon',
  'squire',
  'lib/promise',
  '../../mocks/helpers',
  '../../mocks/lib/session',
  '../../mocks/views/base',
  '../../mocks/views/form',
  '../../mocks/views/decorators/allow_only_one_submit',
  '../../mocks/views/decorators/progress_indicator',
  '../../mocks/views/mixins/account-locked-mixin',
  '../../mocks/views/mixins/avatar-mixin',
  '../../mocks/views/mixins/migration-mixin',
  '../../mocks/views/mixins/password-mixin',
  '../../mocks/views/mixins/resume-token-mixin',
  '../../mocks/views/mixins/service-mixin',
  '../../mocks/views/mixins/signup-disabled-mixin'
],
function (chai, sinon, Squire, p, mockHelpers, mockSession, MockBaseView,
  MockFormView, mockAllowOnlyOneSubmit, mockShowProgressIndicator,
  mockAccountLockedMixin, mockAvatarMixin, mockMigrationMixin,
  mockPasswordMixin, mockResumeTokenMixin, mockServiceMixin,
  mockSignupDisabledMixin) {
  'use strict';

  var assert = chai.assert;

  suite('require views/sign_in', function () {
    var mocks, injector, view;

    setup(function (done) {
      mocks = {
        'lib/session': mockSession,
        'stache!templates/sign_in': {},
        'views/base': MockBaseView,
        'views/decorators/allow_only_one_submit': mockAllowOnlyOneSubmit,
        'views/decorators/progress_indicator': mockShowProgressIndicator,
        'views/form': MockFormView,
        'views/mixins/account-locked-mixin': mockAccountLockedMixin,
        'views/mixins/avatar-mixin': mockAvatarMixin,
        'views/mixins/migration-mixin': mockMigrationMixin,
        'views/mixins/password-mixin': mockPasswordMixin,
        'views/mixins/resume-token-mixin': mockResumeTokenMixin,
        'views/mixins/service-mixin': mockServiceMixin,
        'views/mixins/signup-disabled-mixin': mockSignupDisabledMixin
      };
      injector = new Squire();
      injector.mock(mocks);
      injector.require(['views/sign_in'], function (v) {
        view = v;
        done();
      });
    });

    teardown(function () {
      mockHelpers.reset(mocks);
    });

    test('require returned view object', function () {
      assert.isObject(view);
    });

    test('view object has correct template property', function () {
      assert.equal(view.template, mocks['stache!templates/sign_in']);
    });

    test('view object has correct className property', function () {
      assert.equal(view.className, 'sign-in');
    });

    test('view object has correct events property', function () {
      assert.deepEqual(view.events, {
        'change .show-password': 'onPasswordVisibilityChange',
        'click .use-different': 'useDifferentAccount',
        'click .use-logged-in': 'useLoggedInAccount',
        'click a[href="/confirm_account_unlock"]': 'sendAccountLockedEmail'
      });
    });

    test('view object has initialize method', function () {
      assert.isFunction(view.initialize);
    });

    test('view object has beforeRender method', function () {
      assert.isFunction(view.beforeRender);
    });

    test('view object has getAccount method', function () {
      assert.isFunction(view.getAccount);
    });

    test('view object has getPrefillEmail method', function () {
      assert.isFunction(view.getPrefillEmail);
    });

    test('view object has context method', function () {
      assert.isFunction(view.context);
    });

    test('view object has afterRender method', function () {
      assert.isFunction(view.afterRender);
    });

    test('view object has afterVisible method', function () {
      assert.isFunction(view.afterVisible);
    });

    test('view object has beforeDestroy method', function () {
      assert.isFunction(view.beforeDestroy);
    });

    test('view object has submit method', function () {
      assert.isFunction(view.submit);
    });

    test('view object has onSignInError method', function () {
      assert.isFunction(view.onSignInError);
    });

    test('view object has onSignInSuccess method', function () {
      assert.isFunction(view.onSignInSuccess);
    });

    test('view object has onSignInUnverified method', function () {
      assert.isFunction(view.onSignInUnverified);
    });

    test('view object has onSignInSuccess method', function () {
      assert.isFunction(view.onSignInSuccess);
    });

    test('view object has onSignInUnverified method', function () {
      assert.isFunction(view.onSignInUnverified);
    });

    test('view object has useDifferentAccount method', function () {
      assert.isFunction(view.useDifferentAccount);
    });

    test('view object has notifyOfLockedAccount method', function () {
      assert.isFunction(view.notifyOfLockedAccount);
    });

    test('view object has sendAccountLockedEmail method', function () {
      assert.isFunction(view.sendAccountLockedEmail);
    });

    test('view object has onProfileUpdate method', function () {
      assert.isFunction(view.onProfileUpdate);
    });

    test('view object has displayAccountProfileImage method', function () {
      assert.isFunction(view.displayAccountProfileImage);
    });

    test('view object has hasDisplayedAccountProfileImage method', function () {
      assert.isFunction(view.hasDisplayedAccountProfileImage);
    });

    test('view object has logAccountImageChange method', function () {
      assert.isFunction(view.logAccountImageChange);
    });

    test('view object has updateProfileImage method', function () {
      assert.isFunction(view.updateProfileImage);
    });

    test('view object has deleteDisplayedAccountProfileImage method', function () {
      assert.isFunction(view.deleteDisplayedAccountProfileImage);
    });

    test('view object has updateDisplayName method', function () {
      assert.isFunction(view.updateDisplayName);
    });

    test('view object has isMigration method', function () {
      assert.isFunction(view.isMigration);
    });

    test('view object has onPasswordVisibilityChange method', function () {
      assert.isFunction(view.onPasswordVisibilityChange);
    });

    test('view object has isPasswordAutoCompleteDisabled method', function () {
      assert.isFunction(view.isPasswordAutoCompleteDisabled);
    });

    test('view object has setPasswordVisibility method', function () {
      assert.isFunction(view.setPasswordVisibility);
    });

    test('view object has getResumeToken method', function () {
      assert.isFunction(view.getResumeToken);
    });

    test('view object has getStringifiedResumeToken method', function () {
      assert.isFunction(view.getStringifiedResumeToken);
    });

    test('view object has transformLinks method', function () {
      assert.isFunction(view.transformLinks);
    });

    test('view object has displayErrorUnsafe method', function () {
      assert.isFunction(view.displayErrorUnsafe);
    });

    test('view object has isSignupDisabled method', function () {
      assert.isFunction(view.isSignupDisabled);
    });

    test('view object has getSignupDisabledReason method', function () {
      assert.isFunction(view.getSignupDisabledReason);
    });
  });
});

