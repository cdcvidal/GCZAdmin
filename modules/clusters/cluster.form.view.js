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
      sortable('.js-sortable-subcluster-maplayers', {
        handle: '.handle-subcluster-maplayer'
      });
    }

});

module.exports = Layout;
