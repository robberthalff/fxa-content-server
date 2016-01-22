/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// https://github.com/tactivos/grunt-cdn

module.exports = function (grunt) {
  grunt.config('cdn', {
    options: {
      cdn: 'http://127.0.0.1:3031',
      ignorePath: '/experiments.bundle.js'
    },
    dist: {
      cwd: '<%= yeoman.dist %>',
      dest: '<%= yeoman.dist %>',
      src: ['*.html', '**/*.html', '**/*.css']
    },
    pages: {
      cwd: '<%= yeoman.page_template_dist %>',
      dest: '<%= yeoman.page_template_dist %>',
      src: ['**/*.html']
    }
  });
};
