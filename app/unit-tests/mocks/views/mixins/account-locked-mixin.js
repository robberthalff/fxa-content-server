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
    events: {
      'click a[href="/confirm_account_unlock"]': 'sendAccountLockedEmail'
    },

    notifyOfLockedAccount: sinon.spy(),

    sendAccountLockedEmail: sinon.spy(function () {
      return p();
    })
  };
});

