'use strict';
var Backbone = require('backbone');
var appConfig = require('../main/config');


var Model = Backbone.Model.extend({
    defaults: {
      sensors: [],
      name: '',
      lat: null,
      lng: null,
      deviceAlertTracking: '',
      openData: '',
      alertType: null,
      collectionFrequency: 0,
      activate: true,
      meta_data: {}
    },

    url: appConfig.apiBaseURL + '/devices/',

});

module.exports = Model;
