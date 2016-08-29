'use strict';
var Backbone = require('backbone');
var appConfig = require('../main/config');
var i18n = require('i18next-client');

var Model = Backbone.Model.extend({
    urlRoot: appConfig.apiBaseURL + '/devices'
});

module.exports = Model;
