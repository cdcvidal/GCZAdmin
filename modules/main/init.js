'use strict';

var Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    $ = require('jquery'),
    datetimepicker = require('eonasdan-datetimepicker'),
    $ns = require('jquery-ns'),
    $nsFabDial = require('jquery-ns-fab_dial'),
    appConfig = require('../main/config'),
    bootstrap = require('bootstrap'),
    bootstrapSwitch = require('bootstrap-switch'),
    Dialog = require('bootstrap-dialog'),
    Main = require('./main.view'),
    session = require('./session'),
    moment = require('moment'),
    momentFr = require('moment/locale/fr'),
    numeral = require('numeral'),
    numeralEn = require('numeral/languages/en-gb'),
    numeralFr = require('numeral/languages/fr'),
    _ = require('lodash'),
    _ns = require('lodash-ns'),
    i18n = require('i18next-client'),
    Router = require('../routing/router'),
    css_browser_selector = require('css_browser_selector');

function init() {
    $('html').addClass(document.ontouchstart === undefined ? 'notouch' : 'touch');
    
    // Global intercept of AJAX error
    $(document).ajaxError(function(evt, jqXhr, params, err) {
        console.log('Request failed: ' + params.url, arguments);
    });

    Marionette.Renderer.render = function(template, data) {
        return template(data);
    };

    var dfdSession, getI18n;

    numeral.language('fr', numeralFr);
    numeral.language('en', numeralEn);

    getI18n = function() {
        var dfd = $.Deferred();
        var userLanguage = 'en';
        //console.log(navigator);
        if( !navigator.language) // ie 10
        {
            userLanguage = localStorage.getItem('userLanguage_'+appConfig.baseUrl) || navigator.userLanguage.split('-').shift() ;
        } else {
            userLanguage = localStorage.getItem('userLanguage_'+appConfig.baseUrl) || navigator.language.split('-').shift();
        }

        i18n.init({
            getAsync: false,
            lng: userLanguage,
            fallbackLng: false,
            useCookie: false,
            resGetPath: 'data/locales/__lng__/__ns__.json'
        }, function(error, t) {
            if ( !error ) {
                numeral.language(i18n.lng());
                dfd.resolve();
            } else
                i18n.setLng('en');
        });

        return dfd;
    };

    var app = new Marionette.Application();
    app.on('start', function() {
        Router.getInstance();

        Main.init();
        Main.getInstance().render();

        Backbone.history.start();
    });

    getI18n()
        .then(function() {
            var token = localStorage.getItem('auth0_token_'+appConfig.baseUrl);
            if (token !== null) {
                //atob won't be supported by IE<10
                var jwt_body = JSON.parse(atob(token.split('.')[1]));
                var expDate = new Date(jwt_body.exp * 1000);
                var mExpDate = moment(expDate);
                var mNow = moment();
                if (mExpDate < mNow ) {
                    // cookie has expired
                    console.warn('the session has expired');
                    return session.close();
                } else {
                    // cookie is still valid
                    console.info('the session is valid to ' + expDate);
                    return session.updateProfile(token);
                }
            }
            return null;
        })
        .then(function() {
            app.start();
        });
}

$(document).ready(function(){
    init();
});
