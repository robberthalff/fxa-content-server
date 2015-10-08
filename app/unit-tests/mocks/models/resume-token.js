/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'sinon'
],
function (sinon) {
  'use strict';

  var MockResumeToken = sinon.spy();

  MockResumeToken.prototype.initialize = sinon.spy();

  MockResumeToken.prototype.stringify = sinon.spy(function () {
    return '';
  });

  MockResumeToken.createFromStringifiedResumeToken = sinon.spy(function () {
    return new MockResumeToken();
  });

  return MockResumeToken;
});

