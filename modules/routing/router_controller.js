'use strict';

var Marionette = require('backbone.marionette');
var $ = require('jquery');
var Router = require('./router');
var session = require('../main/session');
var Main = require('../main/main.view');
var Login = require('../user/login.view');


module.exports = Marionette.Object.extend({
    goToLogin: function() {
        Router.getInstance().navigate('#login', {
            trigger: true
        });
    },

    indexAction: function() {
        Router.getInstance().navigate('#devices', {
            trigger: true
        });
    },

    logoutAction: function() {
        session.close();
        this.goToLogin();
    },

    loginAction: function() {
        Main.getInstance().rgMain.show(new Login(), {
            preventDestroy: true
        });
    }

});
