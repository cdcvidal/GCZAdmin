'use strict';
var Backbone = require('backbone');
var appConfig = require('../main/config');
var i18n = require('i18next-client');

var Model = Backbone.Model.extend({
    urlRoot: appConfig.apiBaseURL + '/devices',
    defaults: {
      alertTypes: ['email', 'sms'],
      collectionFrequencies: [10,15,30,60,120,180,360,720,1440]
    }
});

module.exports = Model;
