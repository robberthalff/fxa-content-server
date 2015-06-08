/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';


define([
  'chai',
  'jquery',
  'sinon',
  'views/settings/avatar_change',
  '../../../mocks/router',
  '../../../mocks/file-reader',
  '../../../mocks/profile',
  '../../../mocks/window',
  'models/user',
  'models/reliers/relier',
  'lib/profile-client',
  'lib/promise',
  'lib/auth-errors'
],
function (chai, $, sinon, View, RouterMock, FileReaderMock, ProfileMock,
            WindowMock, User, Relier, ProfileClient, p, AuthErrors) {
  var assert = chai.assert;
  var pngSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQYV2P4DwABAQEAWk1v8QAAAABJRU5ErkJggg==';

  describe('views/settings/avatar/change', function () {
    var view;
    var routerMock;
    var profileClientMock;
    var windowMock;
    var user;
    var account;
    var relier;

    beforeEach(function () {
      routerMock = new RouterMock();
      user = new User();
      profileClientMock = new ProfileMock();
      windowMock = new WindowMock();
      relier = new Relier();

      view = new View({
        user: user,
        relier: relier,
        router: routerMock,
        window: windowMock
      });
    });

    afterEach(function () {
      $(view.el).remove();
      view.destroy();
      view = null;
      routerMock = null;
      profileClientMock = null;
    });

    describe('with no session', function () {
      it('redirects to signin', function () {
        return view.render()
            .then(function () {
              assert.equal(routerMock.page, 'signin');
            });
      });
    });

    describe('with session', function () {
      var accessToken = 'token';
      beforeEach(function () {
        view = new View({
          router: routerMock,
          relier: relier,
          window: windowMock,
          user: user
        });
        view.isUserAuthorized = function () {
          return p(true);
        };
        account = user.initAccount({
          email: 'a@a.com',
          verified: true,
          accessToken: accessToken
        });
        sinon.stub(account, 'getAvatar', function () {
          return p({ avatar: pngSrc, id: 'foo' });
        });
        sinon.stub(account, 'profileClient', function () {
          return p(profileClientMock);
        });
        sinon.stub(view, 'getSignedInAccount', function () {
          return account;
        });

        return view.render();
      });

      it('hides the file picker', function () {
        assert.isFalse(view.$(':file').is(':visible'));
      });

      it('hides the gravatar option', function () {
        assert.equal(view.$('#gravatar').length, 0);
      });

      it('shows the gravatar option for test emails', function () {
        account.set('email', 'avatarAB-test@restmail.net');
        return view.render()
          .then(function () {
            assert.equal(view.$('#gravatar').length, 1);
          });
      });

      it('can remove the avatar', function () {
        sinon.stub(view, 'deleteDisplayedAccountProfileImage', function () {
          return p();
        });

        return view.afterVisible()
          .then(function () {
            assert.equal(view.$('.avatar-wrapper img').length, 1);
            return view.remove();
          })
          .then(function () {
            assert.isTrue(view.deleteDisplayedAccountProfileImage.called);
            assert.equal(routerMock.page, 'settings');
          });
      });

      it('shows error if delete fails', function () {
        sinon.stub(profileClientMock, 'deleteAvatar', function () {
          return p.reject(ProfileClient.Errors.toError('IMAGE_PROCESSING_ERROR'));
        });

        return view.afterVisible()
          .then(function () {
            assert.equal(view.$('.avatar-wrapper img').length, 1);
            return view.remove();
          })
          .then(function () {
            assert.fail('unexpected success');
          }, function (err) {
            assert.isTrue(ProfileClient.Errors.is(err, 'IMAGE_PROCESSING_ERROR'));
            assert.isTrue(view.isErrorVisible(), 'error is visible');
            assert.notEqual(routerMock.page, 'settings');
          });
      });

      describe('with a file selected', function () {
        it('errors on an unsupported file', function () {
          return view.afterVisible()
            .then(function () {
              var ev = FileReaderMock._mockTextEvent();
              view.fileSet(ev);

              assert.equal(view.$('.error').text(), AuthErrors.toMessage('UNUSABLE_IMAGE'));
              assert.isTrue(view.isErrorVisible());
            });
        });

        it('errors on a bad image', function () {
          view.FileReader = FileReaderMock;

          return view.afterVisible()
            .then(function () {
              var ev = FileReaderMock._mockBadPngEvent();
              return view.fileSet(ev)
                .then(function () {
                  assert.fail('unexpected success');
                }, function () {
                  assert.equal(view.$('.error').text(), AuthErrors.toMessage('UNUSABLE_IMAGE'));
                  assert.isTrue(view.isErrorVisible());
                });
            });
        });

        it('loads a supported file', function (done) {
          view.FileReader = FileReaderMock;

          view.afterVisible()
            .then(function () {
              var ev = FileReaderMock._mockPngEvent();

              view.router.on('navigate', function () {
                try {
                  var cropImg = view.ephemeralMessages.get('data').cropImg;
                  assert.equal(routerMock.page, 'settings/avatar/crop');
                  assert.equal(cropImg.get('src'), pngSrc);
                  done();
                } catch (e) {
                  return done(e);
                }
              });

              view.fileSet(ev);
            })
            .fail(done);
        });
      });

      it('clears setting param if set to avatar', function () {
        relier.set('setting', 'avatar');
        return view.render()
          .then(function () {
            assert.isUndefined(relier.get('setting'));
          });
      });

    });

  });
});


