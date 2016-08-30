'use strict';

var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var i18n = require('i18next-client');
var _ = require('lodash');
var $ = require('jquery');
var notify = require('../notifications/notify').notify;

var Layout = Marionette.LayoutView.extend({
    name: 'device_settings',
    className: 'page scrollable model-edition',
    events: {
        'reset form': 'onReset',
        'submit form': 'onSubmit',
        'change textarea,input,select,checkbox': 'onFormChange'
    },

    initialize: function() {
      var self = this;
      if (!this.model.isNew()) {
        this.$el.addClass('processing');
        this.model.fetch().done(function() {
          self.$el.removeClass('processing');
          self.render();
        });
      }
    },

    onShow: function(options) {
        var self = this;
        this.$el.find('input[type="checkbox"]').bootstrapSwitch();
        this.$el.find('input[type="checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
            self.onFormChange();
        });
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

    onReset: function(e) {
        window.underEdition = false;
        Backbone.history.loadUrl(Backbone.history.fragment);
    },

    onSubmit: function(e) {
        var self = this;
        e.preventDefault();

        var formData = _.unserialize($(e.currentTarget).serialize());
        this.model.set(formData);

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
