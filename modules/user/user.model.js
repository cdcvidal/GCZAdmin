'use strict';
var Backbone = require('backbone');

var Model = Backbone.Model.extend({
    defaults: {
        username: '',
        email: ''
    }
});

module.exports = Model;
