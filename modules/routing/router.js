'use strict';

var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var session = require('../main/session');

var i18n = require('i18next-client');
var MainView = require('../main/main.view');

var bootstrap = require('bootstrap');
var Dialog = require('bootstrap-dialog');

var Router = Marionette.AppRouter.extend({
    appRoutes: {
        '': 'indexAction',
        'login': 'loginAction',
        'logout': 'logoutAction',

        'drivers': 'driversAction',

        'clusters': 'clustersAction',
        'clusters/new': 'clusterAction',
        'clusters/:id': 'clusterAction',

        'devices': 'devicesAction',
        'devices/new': 'deviceAction',
        'devices/:id': 'deviceAction',

        '*notFound' : 'indexAction'
    },

    execute: function(callback, args, action){

        if (session.opened) {
            // user connected
            if( action === 'loginAction') {
                this.navigate('', { // redirect home
                    trigger: true
                });
            } else {
                if(window.underEdition){
                    this.preventFormQuit(callback, args);
                    return;
                } else {
                    callback.apply(this, args);
                }
            }
        }
        else {
            // user unconnected
            this.navigate('#login', {
                trigger: true
            });
            if( action === 'loginAction' || action ==='logoutAction'){ // execute route
                 callback.apply(this, args);
             }
        }
    },

    onRoute: function(name, args) {
        this.routeHistory.push({
          fragment : Backbone.history.fragment
        });
    },

    preventFormQuit: function (callback, args) {
        var self = this;

        Dialog.show({
          title: i18n.t('form.preventExit.title'),
          message: i18n.t('form.preventExit.text'),
          buttons: [{
            label: i18n.t('form.preventExit.preventExit'),
            action: function(dialog) {
              dialog.close();
              var frag = self.routeHistory[(self.routeHistory.length - 2)].fragment;
              self.navigate('#' + frag, {
                  trigger: false
              });
              self.routeHistory.push({
                fragment : frag
              });
            }
          }, {
            label: i18n.t('form.preventExit.confirmExit'),
            action: function(dialog) {
              dialog.close();
              callback.apply(self, args);
            }
          }]
        });
    },


    initialize: function(options) {
        this.routeHistory = [];
    },
});

var instance = null;

module.exports = {
    getInstance: function() {
        if (!instance)
            instance = new Router({
                controller: new(require('./router_controller'))()
            });
        return instance;
    }
};
