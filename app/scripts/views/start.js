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

    initialize: function () {
      if (this.window.navigator.language === 'ja') {
        this.translator.translations['Sign in to Sync'] = '既に同期サービスにサインインしています';
        this.translator.translations['Choose the account you would like to use to sync your tabs, bookmarks, passwords & more.'] = 'あなたは、タブ、ブックマーク、パスワード＆詳細同期するために使用したいアカウントを選択してください。';
      }
    },

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

