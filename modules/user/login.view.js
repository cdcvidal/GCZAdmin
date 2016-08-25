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
        console.log(err);
      }
      else{
        session.open(profile, token);
        Router.getInstance().navigate('', {trigger:true});
      }
    });
    // jshint ignore:end
  }
});

module.exports = Layout;
