/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'sinon'
],
function (sinon) {
  'use strict';

  var MockFormView = sinon.spy();

  MockFormView.prototype.afterRender = sinon.spy();

  MockFormView.prototype.afterVisible = sinon.spy();

  MockFormView.extend = sinon.spy(function (arg) {
    return arg;
  });

  return MockFormView;
});

