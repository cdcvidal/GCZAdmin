'use strict';

var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var i18n = require('i18next-client');
var _ = require('lodash');
var $ = require('jquery');
var notify = require('../notifications/notify').notify;
var qs = require('qs');
var bootstrap = require('bootstrap');
var Dialog = require('bootstrap-dialog');

var Layout = Marionette.LayoutView.extend({
    name: 'device_settings',
    className: 'page scrollable model-edition',
    events: {
        'reset form': 'reload',
        'submit form': 'onSubmit',
        'change textarea,input,select,checkbox': 'onFormChange'
    },

    initialize: function() {
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

    initRestorable: function(options) {
      var self = this;
      var $target = options.$target;
      $target.find('.btn-preview').click(function() {
        var revId = $target.find('select').val();
        if (!revId) {
          return false;
        }
        var $message = $('<textarea class="form-control"></textarea>');
        var dialog = Dialog.show({
            title: '',
            message: $message
        });
        options.loadPreview(revId).done(function(response) {
          $message.val(JSON.stringify(response, null, '  '));
        });
      });
      $target.find('.btn-apply').click(function() {
        var revId = $target.find('select').val();
        $target.addClass('loading');
        options.loadContent(revId).done(function(response) {
          $target.removeClass('loading');
          $target.find('textarea').val(JSON.stringify(response, null, '  '));
        });
      });
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
