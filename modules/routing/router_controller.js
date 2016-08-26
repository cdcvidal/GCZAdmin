'use strict';

var Marionette = require('backbone.marionette');
var $ = require('jquery');
var Router = require('./router');
var session = require('../main/session');
var Main = require('../main/main.view');
var Login = require('../user/login.view');
var Devices = require('../devices/devices.view');


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
    Main.getInstance().rgMain.show(new Login(), {
        preventDestroy: true
    });
  },

  clustersAction: function(){
    console.log('clustersAction');
  },

  devicesAction: function(){
    var rgMain = Main.getInstance().rgMain;
    var view = rgMain.currentView;
    view = new Devices();
    rgMain.show(view);

  }

});
