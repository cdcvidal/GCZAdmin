'use strict';

var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var i18n = require('i18next-client');
var _ = require('lodash');
var $ = require('jquery');
var sortable = require('html5sortable');
var FormView = require('../dataviz/form.view');

var Layout = FormView.extend({
    template: require('./cluster.form.tpl.html'),
    onReady: function(options) {
      var self = this;
      var $sortables = this.$el.find('.js-sortable-subclusters');
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
});

module.exports = Layout;
