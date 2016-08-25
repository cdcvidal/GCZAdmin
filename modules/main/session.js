'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
var i18n = require('i18next-client');
var appConfig = require('./config');
var _ = require('lodash');
var moment = require('moment');

/* jshint ignore:start */
var lock = new Auth0Lock('LLIeCazHTJS8odUmdhrG2enWwPinrj51', 'humm-server.eu.auth0.com');
/* jshint ignore:end */


var Session = Backbone.Model.extend({

  opened: false,

  open: function() {
    var self = this;
    this.setData();
    this.opened = true;
    self.trigger('open');


    $.ajaxSetup({
      beforeSend: function(xhr) {
        if (localStorage.getItem('auth0_token_' + appConfig.baseUrl)) {
          xhr.setRequestHeader('Authorization', 'bearer ' + localStorage.getItem('auth0_token_' + appConfig.baseUrl));
        } else {
          xhr.setRequestHeader('Authorization', '');
        }
      },
      error: function(jqXhr, status, error) {
        self.checkTokenValidity(true);
      }
    });

    var dfd = $.Deferred();

    dfd.resolve();
    
    return dfd.promise();
  },

  checkTokenValidity: function(redirect) {
    var Router = require('../routing/router');
    var token = localStorage.getItem('auth0_token_' + appConfig.baseUrl);
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

  updateProfile: function(token) {
    var self = this;
    var dfd = $.Deferred();

    /* jshint ignore:start */
    lock.getProfile(token, function(err, profile) {
      localStorage.setItem('userEmail_' + appConfig.baseUrl, profile.email);
      if (profile.app_metadata) {
        localStorage.setItem('clusterName_' + appConfig.baseUrl, profile.app_metadata.cluster_name);
        localStorage.setItem('clusterId_' + appConfig.baseUrl, profile.app_metadata.msid);
      }
      if (profile.user_metadata) {
        localStorage.setItem('userName_' + appConfig.baseUrl, profile.user_metadata.name);
      }
      $.when(self.open()).then(function() {
        dfd.resolve();
      });
    });

    /* jshint ignore:end */
    return dfd.promise();
  },

  setData: function() {
    this.set('fullname', localStorage.getItem('userName_' + appConfig.baseUrl));
  },

  close: function() {
    this.opened = false;
    this.clear();
    localStorage.removeItem('userName_' + appConfig.baseUrl);
    localStorage.removeItem('auth0_token_' + appConfig.baseUrl);
    localStorage.removeItem('userLanguage_' + appConfig.baseUrl);
    localStorage.removeItem('clusterName_' + appConfig.baseUrl);
    localStorage.removeItem('clusterId_' + appConfig.baseUrl);
    localStorage.removeItem('userEmail_' + appConfig.baseUrl);
    this.trigger('close');
  }
});

module.exports = new Session();
