'use strict';

var Marionette = require('backbone.marionette'),
    _ = require('lodash');

var View = Marionette.LayoutView.extend({
    template: require('./header.html'),
    className: 'inner clearfix',

    events: {
        //'click .btn_back': 'onBackClick'
    },
    // !!! A trigger selector disable an event selector
    triggers: {
        //'click .btn_back': 'btn:back:click',
        'click .btn_menu': 'btn:menu:click'
    },
    btns: {
        menu: {
            icon: 'menu'
        },
        back: {
            icon: 'arrow_back'
        }
    },

    serializeData: function() {
        var self = this;

        var data = self.data || {};
        data = _.defaultsDeep(data, {
            buttons: {
                left: ['back'],
                right: ['menu'],
            }
        });

        _.forEach(data.buttons, function(side, sideName) {
            if ( side == 'none' )
                data.buttons[sideName] = [];
            else {
                _.forEach(side, function(btnName, index) {
                    var config = self.btns[btnName];
                    side[index] = {
                        name: btnName,
                        icon: config.icon
                    };
                });
            }
        });

        return data;
    },

    set: function(data) {
        var self = this;

        self.data = _.cloneDeep(data);
        if ( !self.data || self.data == 'none' )
            self.data = {
                classNames: 'hidden'
            };

        Marionette.LayoutView.prototype.render.apply(self);
    },

    onRender: function(options) {
        var $wrapper = this.$el.parent('header');
        if ( !this.defaultClassNames )
            this.defaultClassNames = $wrapper.attr('class');

        $wrapper.attr('class', this.defaultClassNames +' '+ _.get(this.data, 'classNames', ''));
    },

    onBackClick: function() {
        window.history.back();
    }
});

var instance = null;

module.exports = {
    getInstance: function() {
        if ( !instance )
            instance = new View();
        return instance;
    }
};
