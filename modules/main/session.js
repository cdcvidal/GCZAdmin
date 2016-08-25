'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
var i18n = require('i18next-client');
var appConfig = require('./config');
var _ = require('lodash');
var moment = require('moment');
var User = require('../user/user.model');


var Session = Backbone.Model.extend({

  opened: false,

  open: function(profile, token) {
    var self = this;
    this.opened = true;
    this.set('token', token);
    localStorage.setItem('auth0Token', token);
    self.trigger('open');

    $.ajaxSetup({
      beforeSend: function(xhr) {
        if (token) {
          xhr.setRequestHeader('Authorization', 'bearer ' + token);
        } else {
          xhr.setRequestHeader('Authorization', '');
        }
      },
      error: function(jqXhr, status, error) {
        self.checkTokenValidity(true);
      }
    });

    self.set('user', new User(profile));
  },

  checkTokenValidity: function(redirect) {
    var Router = require('../routing/router');
    var token = localStorage.getItem('auth0Token');
    if (token !== null) {
      //atob won't be supported by IE<10
      var jwt_body = JSON.parse(atob(token.split('.')[1]));
      var expDate = new Date(jwt_body.exp * 1000);
      var mExpDate = moment(expDate);
      var mNow = moment();
      if (mExpDate < mNow) {
        // cookie has expired
        console.warn('the session has expired');
        if (redirect) {
          Router.getInstance().navigate('logout', {
            trigger: true
          });
        }
      }
    }
  },

  close: function() {
    this.opened = false;
    this.clear();
    localStorage.removeItem('auth0Token');
    localStorage.removeItem('userLanguage');
    this.trigger('close');
  }
});

module.exports = new Session();
