'use strict';

var Marionette = require('backbone.marionette');
var Router = require('./router');
var session = require('../main/session');
var MainView = require('../main/main.view');
var LoginView = require('../user/login.view');
var GridView = require('../dataviz/grid.view');
var FormView = require('../dataviz/form.view');
var Devices = require('../devices/devices.model');
var Device = require('../devices/device.model');
var Clusters = require('../clusters/clusters.model');
var Cluster = require('../clusters/cluster.model');
var ClusterForm = require('../clusters/cluster.form.view');
var ClusterForms = require('../clusters/cluster.forms.view');


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
    MainView.getInstance().rgMain.show(new LoginView());
  },

  clustersAction: function() {
    MainView.getInstance().rgMain.show(new GridView({
      model: new Clusters()
    }));
  },

  clusterAction: function(id) {
    MainView.getInstance().rgMain.show(new ClusterForms({
      model: new Cluster({
        id: id
      })
    }));
  },

  devicesAction: function() {
    MainView.getInstance().rgMain.show(new GridView({
      model: new Devices()
    }));
  },

  deviceAction: function(id) {
    var device = new Device({
      id: id
    });
    MainView.getInstance().rgMain.show(new FormView({
      template: require('../devices/device.form.tpl.html'),
      model: device
    }));
  }

});
