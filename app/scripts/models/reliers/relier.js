/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * A relier is a model that holds information about the RP.
 *
 * A subclass should override `resumeTokenFields` to add/modify which
 * fields are saved to and populated from a resume token in the resume
 * query parameter.
 */

define(function (require, exports, module) {
  'use strict';

  var BaseRelier = require('models/reliers/base');
  var Cocktail = require('cocktail');
  var Constants = require('lib/constants');
  var p = require('lib/promise');
  var ResumeTokenMixin = require('models/mixins/resume-token');
  var SearchParamMixin = require('models/mixins/search-param');
  var Validate = require('lib/validate');

  var RELIER_FIELDS_IN_RESUME_TOKEN = [
    'utmTerm',
    'utmSource',
    'utmMedium',
    'utmContent',
    'utmCampaign',
    'campaign',
    'entrypoint'
  ];

  var Relier = BaseRelier.extend({
    defaults: {
      allowCachedCredentials: true,
      campaign: null,
      email: null,
      entrypoint: null,
      preVerifyToken: null,
      service: null,
      utmCampaign: null,
      utmContent: null,
      utmMedium: null,
      utmSource: null,
      utmTerm: null
    },

    initialize: function (options) {
      options = options || {};

      this.window = options.window || window;
    },

    /**
     * Hydrate the model. Returns a promise to allow
     * for an asynchronous load. Sub-classes that override
     * fetch should still call Relier's version before completing.
     *
     * e.g.
     *
     * fetch: function () {
     *   return Relier.prototype.fetch.call(this)
     *       .then(function () {
     *         // do overriding behavior here.
     *       });
     * }
     *
     * @method fetch
     */
    fetch: function () {
      var self = this;
      return p()
        .then(function () {
          // parse the resume token before importing any other data.
          // query parameters and server provided data override
          // resume provided data.
          self.populateFromStringifiedResumeToken(self.getSearchParam('resume'));

          self.importSearchParam('service');
          self.importSearchParam('preVerifyToken');
          self.importSearchParam('uid');
          self.importSearchParam('setting');
          self.importSearchParam('entrypoint');
          if (! self.has('entrypoint')) {
            // FxDesktop declares both `entryPoint` (capital P) and
            // `entrypoint` (lowcase p). Normalize to `entrypoint`.
            self.importSearchParam('entryPoint', 'entrypoint');
          }
          self.importSearchParam('campaign');

          self.importSearchParam('utm_campaign', 'utmCampaign');
          self.importSearchParam('utm_content', 'utmContent');
          self.importSearchParam('utm_medium', 'utmMedium');
          self.importSearchParam('utm_source', 'utmSource');
          self.importSearchParam('utm_term', 'utmTerm');

          // A relier can indicate they do not want to allow
          // cached credentials if they set email === 'blank'
          var email = self.getSearchParam('email');
          if (email === Constants.DISALLOW_CACHED_CREDENTIALS) {
            self.set('allowCachedCredentials', false);
          } else if (email){
            if (Validate.isEmailValid(email)) {
              self.importSearchParam('email');
            } else {
              throw new TypeError(email + ' must be a valid email');
            }
          }
        });
    },

    /**
     * Check if the relier allows cached credentials. A relier
     * can set email=blank to indicate they do not.
     */
    allowCachedCredentials: function () {
      return this.get('allowCachedCredentials');
    },

    resumeTokenFields: RELIER_FIELDS_IN_RESUME_TOKEN
  });

  Cocktail.mixin(
    Relier,
    ResumeTokenMixin,
    SearchParamMixin
  );

  module.exports = Relier;
});
