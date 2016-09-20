'use strict';

var Marionette = require('backbone.marionette');

var Basic = require('../clusters/cluster.form_basic.view');
var Subclusters = require('../clusters/cluster.form_subclusters.view');

var Layout = Marionette.LayoutView.extend({
    template: require('./cluster.forms.tpl.html'),
    className: 'page model-edition',
    regions: {
        rgBasic: '#form-cluster-basic',
        rgSubclusters: '#form-cluster-subclusters',
        rgDevicetypes: '#form-cluster-devicetypes',
    },

    onShow: function(options) {
        var self = this;
        if (!this.model.isNew()) {
          this.$el.addClass('processing');
          this.model.fetch().done(function() {
            self.model.loadRevisions().done(function(response) {
              self.revisions = response;
              self.onLoad();
            });
          });
        }
    },

    onLoad: function() {
      this.$el.removeClass('processing');
      this.rgBasic.show(new Basic({
        model: this.model
      }));
      this.rgSubclusters.show(new Subclusters({
        model: this.model,
        revisions: this.revisions
      }));
    }
});

module.exports = Layout;
