'use strict';

var Marionette = require('backbone.marionette');
var Router = require('./router');
var session = require('../main/session');
var MainView = require('../main/main.view');
var LoginView = require('../user/login.view');
var DevicesView = require('../devices/devices.view');


module.exports = Marionette.Object.extend({
  goToLogin: function() {
    Router.getInstance().navigate('#login', {
        trigger: true
    });
  },

  indexAction: function() {
    var role = session.get('user').get('app_metadata').role;
    if (role){
      Router.getInstance().navigate('#clusters', {
        trigger: true
      });
    }else{
      Router.getInstance().navigate('#devices', {
        trigger: true
      });
    }
  },

  logoutAction: function() {
    session.close();
    this.goToLogin();
  },

  loginAction: function() {
    MainView.getInstance().rgMain.show(new LoginView(), {
        preventDestroy: true
    });
  },

  clustersAction: function(){
    console.log('clustersAction');
  },

  devicesAction: function(){
    MainView.getInstance().rgMain.show(new DevicesView(), {
        preventDestroy: true
    });
  }

});
