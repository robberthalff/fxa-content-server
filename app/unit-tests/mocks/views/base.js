/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'sinon'
],
function (sinon) {
  'use strict';

  var MockBaseView = sinon.spy();

  MockBaseView.t = sinon.spy();

  MockBaseView.preventDefaultThen = sinon.spy(function (fn) {
    return sinon.spy(fn);
  });

  MockBaseView.extend = sinon.spy(function (arg) {
    return arg;
  });

  return MockBaseView;
});

