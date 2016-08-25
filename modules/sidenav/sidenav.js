'use strict';

var Marionette = require('backbone.marionette'),
    header = require('../header/header'),
    session = require('../main/session'),
    appConfig = require('../main/config'),
    $ = require('jquery');
var t = require('i18next-client').t;

var View = Marionette.LayoutView.extend({
    template: require('./sidenav.html'),
    className: 'inner',
    events: {
        'click': 'hide',
        'click .select-language': 'onLanguageClick',
        'change .select-language': 'onLanguageChange'
    },

    initialize: function() {
        var router = require('../routing/router').getInstance();
        this.listenTo(router, 'route', this.updateActiveItems);

        this.listenTo(header.getInstance(), 'btn:menu:click', this.toggleShow);

        this.listenTo(session, 'open', this.render);
    },

    clearActiveItems: function() {
        this.$el.find('ul.device-registration li.active').removeClass('active');
        this.$el.find('ul#menu li.active').removeClass('active');
    },

    updateActiveItems: function(name, arg1) {
        if (name === 'deviceRegistrationAction') {
            this.clearActiveItems();
            this.$el.find('ul.device-registration li').addClass('active');
        } else
        if (name === 'devicesGridAction' || name === 'devicesMapAction') {
            this.clearActiveItems();
            this.$el.find('ul#menu li').eq(parseInt(arg1) || 0).addClass('active');
        }
    },

    serializeData: function() {
        return {
            username: session.get('fullname'),
            cluster: localStorage.getItem('clusterName_'+appConfig.baseUrl), //session.get('cluster_name'),
            languages: session.get('languages')
        };
    },

    toggleShow: function() {
        $('body').toggleClass('show-sidenav');
    },

    show: function() {
        $('body').addClass('show-sidenav');
    },

    hide: function() {
        $('body').removeClass('show-sidenav');
    },

    onLanguageClick: function(e) {
        e.stopPropagation();
    },

    onLanguageChange: function(e) {
        localStorage.setItem('userLanguage_'+appConfig.baseUrl, $(e.currentTarget).val());
        window.location.reload(true);
    }
});

var instance = null;

module.exports = {
    getInstance: function() {
        if ( !instance )
            instance = new View();
        return instance;
    }
};
