/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'sinon'
],
function (sinon) {
  'use strict';

  return {
    events: {
      'change .show-password': 'onPasswordVisibilityChange'
    },

    isPasswordAutoCompleteDisabled: sinon.spy(function () {
      return true;
    }),

    onPasswordVisibilityChange: sinon.spy(),

    setPasswordVisibility: sinon.spy()
  };
});

