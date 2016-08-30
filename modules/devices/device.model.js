'use strict';
var Backbone = require('backbone');
var appConfig = require('../main/config');
var _ = require('lodash');

var Model = Backbone.Model.extend({
    urlRoot: appConfig.apiBaseURL + '/devices',
    config: {
      alertTypes: ['email', 'sms'],
      collectionFrequencies: [10,15,30,60,120,180,360,720,1440]
    },
    validate: function() {
      var self = this;
      this.set('lat', this.toFloat(this.get('lat')));
      this.set('lng', this.toFloat(this.get('lng')));
      _.forEach(this.get('sensors'), function(sensor) {
        sensor.currentAlertThresholdMin = self.toFloat(sensor.currentAlertThresholdMin);
        sensor.currentAlertThresholdMax = self.toFloat(sensor.currentAlertThresholdMax);
      });
    },
    toFloat: function(value) {
      if (!_.isNumber(value) && !value) {
        return null;
      }
      return parseFloat(value.replace(',', '.'));
    }
});

module.exports = Model;
