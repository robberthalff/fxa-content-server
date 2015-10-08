/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require([
  '../scripts/require_config',
],
function () {
  'use strict';

  var tests = [
    '../unit-tests/spec/views/sign_in'
  ];

  mocha.setup('tdd');
  loadTest(0);

  function loadTest (index) {
    if (index === tests.length) {
      return runTests();
    }

    require([tests[index]], loadTest.bind(null, index + 1));
  }

  function runTests () {
    mocha.globals([
      '_'
    ]);
    mocha.checkLeaks();
    mocha.run();
  }
});

