'use strict';

var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var i18n = require('i18next-client');
var _ = require('lodash');
var $ = require('jquery');
var sortable = require('html5sortable');
var FormView = require('../dataviz/form.view');
var bootstrap = require('bootstrap');
var Dialog = require('bootstrap-dialog');

var Layout = FormView.extend({
    template: require('./cluster.form_devicetype.tpl.html'),
    className: '',

    initialize: function(options) {
      this.revisions = options.revisions;
    },

    serializeData: function() {
        return {
          model: this.model.toJSON(),
          config: this.model.config,
          revisions: this.revisions
        };
    },

    onShow: function(options) {
      this.onLoad();
    },

    onReady: function(options) {
      var self = this;
      this.initRestorable({
        $target: this.$el.find('.restorable'),
        loadRevision: function(revId) {
          var $dfd = $.Deferred();
          return self.model.loadRevision('deviceTypeConfig', revId);
        },
        loadContent: function(revId) {
          var dfd = $.Deferred();
          self.model.loadRevision('configFile', revId).done(function(response) {
            dfd.resolve(response.configdata);
          });

          return dfd.promise();
        }
      });
    }
});

module.exports = Layout;
