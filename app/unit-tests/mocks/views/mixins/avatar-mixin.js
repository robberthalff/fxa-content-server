/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'sinon',
  'lib/promise'
],
function (sinon, p) {
  'use strict';

  return {
    _notifyProfileUpdate: sinon.spy(),

    _shouldShowDefaultProfileImage: sinon.spy(function () {
      return false;
    }),

    _updateCachedProfileImage: sinon.spy(),

    deleteDisplayedAccountProfileImage: sinon.spy(function () {
      return p();
    }),

    displayAccountProfileImage: sinon.spy(function () {
      return p();
    }),

    hasDisplayedAccountProfileImage: sinon.spy(function () {
      return true;
    }),

    initialize: sinon.spy(),

    logAccountImageChange: sinon.spy(),

    onProfileUpdate: sinon.spy(),

    updateDisplayName: sinon.spy(function () {
      return p();
    }),

    updateProfileImage: sinon.spy(function () {
      return p();
    })
  };
});

