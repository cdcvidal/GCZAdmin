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
    template: require('./cluster.form_subclusters.tpl.html'),
    className: '',

    initialize: function(options) {
      this.revisions = options.revisions;
    },

    onShow: function(options) {
      this.onLoad();
    },

    onReady: function(options) {
      var self = this;
      this.$el.find('.collapse').on('show.bs.collapse', function() {
        $(this).parent().removeClass('collapsed');
      });
      this.$el.find('.collapse').on('hide.bs.collapse', function() {
        $(this).parent().addClass('collapsed');
      });
      var $sortables = this.$el.find('.js-sortable-subclusters');
      if ($sortables.length) {
        this.initSortables($sortables);
      }
      this.$el.find('.restorable').find('.btn-preview').click(function() {
        var revId = $(this).parents('.restorable').find('select').val();
        if (!revId) {
          return false;
        }
        var $message = $('<textarea class="form-control"></textarea>');
        var dialog = Dialog.show({
            title: '',
            message: $message
        });
        self.model.loadRevision('configFile', revId).done(function(response) {
          $message.val(JSON.stringify(response, null, '  '));
        });
      });
      this.$el.find('.restorable').find('.btn-apply').click(function() {
        var $parent = $(this).parents('.restorable');
        var revId = $parent.find('select').val();
        $parent.addClass('loading');
        self.model.loadRevision('configFile', revId).done(function(response) {
          $parent.removeClass('loading');
          $parent.find('textarea').val(JSON.stringify(response.configdata, null, '  '));
        });
      });
    },

    initSortables: function($sortables) {
      var self = this;

      sortable($sortables, {
        items: 'fieldset',
        handle: '.handle-subcluster'
      });
      sortable($sortables)[0].addEventListener('sortupdate', function(e) {
        $sortables.children().each(function(index, item) {
          var $me = $(this);
          $me.find('[name^="configFile[navigation_items][queries]"]').each(function() {
            var $input = $(this);
            var inputName = $input.attr('name');
            $input.attr('name', inputName.replace(/\[queries\]\[.*?\]/g, '[queries]['+index+']'));
          });
        });
      });
      sortable('.js-sortable-subcluster-columns', {
        handle: '.handle-subcluster-column'
      });
      sortable('.js-sortable-subcluster-charts', {
        handle: '.handle-subcluster-chart'
      });
      sortable('.js-sortable-subcluster-maplayers', {
        handle: '.handle-subcluster-maplayer'
      });
      this.bindBtn(this.$el);

      var rowTpls = {
        columns: require('./cluster.form.subclustercolumn.tpl.html'),
        charts: require('./cluster.form.subclusterchart.tpl.html'),
        maplayers: require('./cluster.form.subclustermaplayer.tpl.html')
      };

      this.$el.find('.js-btn-add-sortable').click(function() {
        var $me = $(this);
        var $sortables = $me.parents('.form-group').find('.js-sortables');
        var tpl = rowTpls[$sortables.attr('name')];
        var $row = $(tpl({model: self.model.toJSON(), subclusterIdx: $sortables.parents('fieldset').index(), value: ''}));
        $sortables.append($row);
        self.bindBtn($sortables);
        sortable($sortables, 'reload');
      });
    },

    bindBtn: function($target) {
      $target.find('.toggle-subcluster-chart-mode').click(function() {
        var $me = $(this);
        $me.parents('.row').toggleClass('advanced');
      });
      $target.find('.js-btn-remove-sortable').click(function() {
        var $me = $(this);
        $me.parents('.row').remove();
      });
    },

    serializeData: function() {
        return {
          model: this.model.toJSON(),
          config: this.model.config,
          revisions: this.revisions
        };
    },

    onBeforeSubmit: function() {
      this.$el.find('.js-sortable-subcluster-charts').each(function() {
        var $chart = $(this);
        var $rows = $chart.find('.row');
        $rows.each(function() {
          var $row = $(this);
          var $input = $row.find('input');
          if ($row.hasClass('advanced')) {
            $input.val($row.find('textarea').val());
          } else {
            $input.val($row.find('select').val());
          }
        });
      });
    },

    processFormData: function(formData) {
      console.log('processFormData', this.$el.find('#subcluster-query-advanced').length);
      if (this.$el.find('#subcluster-query-advanced').hasClass('active')) {
        delete formData.configFile;
        formData.configFile = formData['configFile-advanced'];
      }
      delete formData['configFile-advanced'];

      return formData;
    }
});

module.exports = Layout;
