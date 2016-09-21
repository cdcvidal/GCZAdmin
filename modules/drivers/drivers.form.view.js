'use strict';

var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var i18n = require('i18next-client');
var _ = require('lodash');
var $ = require('jquery');
var qs = require('qs');
var FormView = require('../dataviz/form.view');
var notify = require('../notifications/notify').notify;

var Layout = FormView.extend({
    template: require('./drivers.form.tpl.html'),

    initialize: function(options) {},

    onShow: function(options) {
        var self = this;
        this.$el.addClass('processing');
        this.model.fetch({
            success: function(model, response, options) {
                console.log(model, response);
                // self.model.set('driver_list', response);
                self.loadRevisions();
            },
            error: function(model, response, options) {
                console.log('fetch drivers error', response);
            }
        });
    },

    loadRevisions: function() {
        var self = this;
        this.model.loadRevisions().done(function(response) {
            self.revisions = response;
            self.onLoad();
        });
    },

    serializeData: function() {
        return {
            model: this.model.toJSON(),
            config: this.model.config,
            revisions: this.revisions
        };
    },

    onReady: function(options) {
        var self = this;
        this.initRestorable({
            $target: this.$el.find('.restorable'),
            loadPreview: function(revId) {
                return self.model.loadRevision(revId);
            },
            loadContent: function(revId) {
                var dfd = $.Deferred();
                self.model.loadRevision(revId).done(function(response) {
                    dfd.resolve(response.configdata.driver_list);
                });

                return dfd.promise();
            }
        });
    },

    onSubmit: function(e) {
        var self = this;
        e.preventDefault();

        var serialized = $(e.currentTarget).serialize();
        var formData = qs.parse(serialized, {
            depth: 10
        });

        this.model.reset(JSON.parse(formData.driver_list));
        $.ajax({
            url: this.model.url,
            data: formData.driver_list,
            type: 'PATCH',
            contentType: 'application/json'
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
