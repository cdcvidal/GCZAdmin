'use strict';

var FormView = require('../dataviz/form.view');

var Layout = FormView.extend({
    template: require('./cluster.form_basic.tpl.html'),
    className: '',

    onShow: function(options) {
      this.onLoad();
    }
});

module.exports = Layout;
