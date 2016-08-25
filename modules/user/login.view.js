'use strict';

var Marionette = require('backbone.marionette');
var session = require('../main/session');
var _ = require('lodash');
var $ = require('jquery');
var appConfig = require('../main/config');
var Router = require('../routing/router');
/* jshint ignore:start */
var lock = new Auth0Lock('LLIeCazHTJS8odUmdhrG2enWwPinrj51', 'humm-server.eu.auth0.com');
/* jshint ignore:end */

var Layout = Marionette.LayoutView.extend({
  name: 'login',
  className: 'login-overlay',
  template: _.template(''),

  initialize: function() {
  },

  loginSuccess: function(resp) {
    Router.getInstance().navigate('devices', {trigger:true});
    var serverTime = new Date() - this.measurementServerStart;
    /* jshint ignore:start */
      ga('send', 'timing', 'Login : '+ localStorage.getItem('clusterName_'+appConfig.baseUrl), 'success', serverTime);
    /* jshint ignore:end */
  },

  loginFailure: function() {
    var serverTime = new Date() - this.measurementServerStart;
    /* jshint ignore:start */
    ga('send', 'timing', 'Login', 'error', serverTime);
    /* jshint ignore:end */
  },

  render: function(options) {
     // jshint ignore:start
    var self = this;
    lock.show({
      disableSignupAction: true,
      closable: false,
      gravatar: false,
      icon : "./images/logo_login.png"
    },function (err, profile, token) {
      if( err ){
        self.loginFailure();
      }
      else{
        self.setLocalStorage(profile,token);
        var dfd = session.open();
        setTimeout(function(){
          $.when( dfd ).done(function(){
            self.loginSuccess(profile);
          });
        }, 0);
      }
    });
    // jshint ignore:end
  },

  setLocalStorage: function(profile, token) {
     localStorage.setItem('auth0_token_'+appConfig.baseUrl, token);
     localStorage.setItem('userEmail_'+appConfig.baseUrl, profile.email);
      if (profile.user_metadata) {
        localStorage.setItem('userName_'+appConfig.baseUrl, profile.user_metadata.name);
      }
     if(profile.app_metadata){
        localStorage.setItem('clusterName_'+appConfig.baseUrl , profile.app_metadata.cluster_name);
        localStorage.setItem('clusterId_'+appConfig.baseUrl , profile.app_metadata.msid);
     }
  }
});

module.exports = Layout;
