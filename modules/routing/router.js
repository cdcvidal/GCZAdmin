'use strict';

var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var session = require('../main/session');

var swal = require('sweetalert');
var i18n = require('i18next-client');
var MainView = require('../main/main.view');

var Router = Marionette.AppRouter.extend({
    appRoutes: {
        '': 'indexAction',
        'login': 'loginAction',
        'logout': 'logoutAction',

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

        swal({
          title: i18n.t('swal.title', {defaultValue: 'Are you sure?'}),
          text: i18n.t('swal.text', {defaultValue: 'Your changes won\'t be saved.'}),
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#ea5323',
          cancelButtonColor: '#3BBCDA',
          cancelButtonText: i18n.t('swal.cancelButtonText', {defaultValue: 'Save and exit'}),
          confirmButtonText: i18n.t('swal.confirmButtonText', {defaultValue: 'Exit without saving'}),
          closeOnConfirm: true,
          html: true
        }, function(isConfirm){
            if (isConfirm) {
              window.underEdition = false;
              callback.apply(self, args);
            } else {
                var settingsView = MainView.getInstance().rgMain.currentView.tabContent.currentView;
                var dfd = settingsView.onSubmit();
                if(dfd) {
                    dfd.done(function(){
                        window.underEdition = false;
                        callback.apply(self, args);
                    });
                } else {
                    var frag = self.routeHistory[(self.routeHistory.length - 2)].fragment;
                    self.navigate('#' + frag, {
                        trigger: false
                    });
                    self.routeHistory.push({
                      fragment : frag
                    });
                }
            }
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
