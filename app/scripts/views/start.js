/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'views/base',
  'views/form',
  'stache!templates/start'
],
function (BaseView, FormView, Template) {
  'use strict';

  var View = FormView.extend({
    template: Template,
    className: 'start',

    events: {
      'click #fxa-button': BaseView.preventDefaultThen('_goToSignUp')
    },

    beforeRender: function () {
      if (! this.relier.has('partnerOpenidUrl')) {
        this.navigate('signup');
        return false;
      }
    },

    _goToSignUp: function () {
      this.navigate('signup');
    },

    submit: function () {
      this.window.location = this.relier.get('partnerOpenidUrl');
      return { halt: true };
    }

  });

  return View;
});

