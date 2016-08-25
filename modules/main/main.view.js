'use strict';

var Marionette = require('backbone.marionette'),
    MainRegion = require('./main.region'),
    Header = require('../header/header'),
    Sidenav = require('../sidenav/sidenav');
var initNotif = require('../notifications/notify').init;

var Layout = Marionette.LayoutView.extend({
    el: '.app',
    template: require('./main.tpl.html'),
    className: 'ns-full-height',

    initialize: function() {
    },

    regions: {
        rgHeader: 'header',
        rgSidenav: 'aside',
        rgMain: new MainRegion({
            el: 'main'
        }),
        rgFooter: 'footer'
    },

    render: function(options) {
        Marionette.LayoutView.prototype.render.apply(this, options);

        this.rgHeader.show(Header.getInstance());
        this.rgSidenav.show(Sidenav.getInstance());

        initNotif();
    }
});

var instance = null;

module.exports = {
    init: function() {
        if ( instance ) {
            console.log('An instance still exists');
        } else {
            instance = new Layout();
        }
    },
    getInstance: function() {
        if ( !instance ) {
            console.log('You have to call init() first');
            return null;
        }
        return instance;
    }
};
