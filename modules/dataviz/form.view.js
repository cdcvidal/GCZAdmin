'use strict';

var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var i18n = require('i18next-client');
var _ = require('lodash');
var $ = require('jquery');
var notify = require('../notifications/notify').notify;
var qs = require('qs');

var Layout = Marionette.LayoutView.extend({
    name: 'device_settings',
    className: 'page scrollable model-edition',
    events: {
        'reset form': 'reload',
        'submit form': 'onSubmit',
        'change textarea,input,select,checkbox': 'onFormChange'
    },

    initialize: function() {
      var self = this;
    },

    onShow: function(options) {
        var self = this;
        if (!this.model.isNew()) {
          this.$el.addClass('processing');
          this.model.fetch().done(function() {
            self.onLoad();
          });
        }
    },

    onLoad: function() {
      var self = this;
      this.$el.removeClass('processing');
      this.render();
      this.$el.find('input[type="checkbox"]').bootstrapSwitch();
      this.$el.find('input[type="checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
          self.onFormChange();
      });
      this.onReady();
    },

    onReady: function() {

    },

    onFormChange: function() {
        window.underEdition = true;
    },

    serializeData: function() {
        return {
          model: this.model.toJSON(),
          config: this.model.config
        };
    },

    reload: function(e) {
        window.underEdition = false;
        Backbone.history.loadUrl(Backbone.history.fragment);
    },

    onBeforeSubmit: function() {

    },

    processFormData: function(formData) {
      return formData;
    },

    onSubmit: function(e) {
        var self = this;
        e.preventDefault();
        this.onBeforeSubmit();
        var serialized = $(e.currentTarget).serialize();
        var formData = qs.parse(serialized, {depth: 10});

        if (!this.model.isNew()) {
          formData.id = this.model.get('id');
        }

        formData = this.processFormData(formData);
        console.log(formData);
        this.model.attributes = formData;

        //var model = this.model.toJSON();
        // _.merge(this.model.attributes, formData, function(a, b) {
        //   if (_.isArray(a)) {
        //     return b;
        //   }
        // });

        if (!this.model.isValid()) {
          notify('warning', i18n.t('common.alert_problem'), i18n.t('form.invalid'));
          return false;
        }

        window.underEdition = false;

        this.$el.addClass('processing');
        this.model.save(null, {
          patch: true,
          validate: false
        }).done(function() {
            notify('success', i18n.t('common.alert_success'), i18n.t('form.success'));
        }).fail(function() {
            notify('danger', i18n.t('common.alert_problem'), i18n.t('form.error'));
        }).always(function() {
            self.$el.removeClass('processing');
        });
    }

});

module.exports = Layout;
