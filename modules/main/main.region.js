'use strict';

var Marionette = require('backbone.marionette'),
    _ = require('lodash'),
    $ = require('jquery'),
    header = require('../header/header'),
    i18n = require('i18next-client');

var Region = Marionette.Region.extend({
    attachHtml: function(view) {
        //TODO: another place for that ?
        if ( this.$el.children('div').length && this.currentView ) {
            var last = this.currentView;
            var $last = last.$el;
            $last.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
                if ( $last.hasClass('animate-close') ) {
                    $('body').alterClass('section-*', 'section-'+ view.name);
                    $last.removeClass('animate animate-close');
                    last.destroy();
                }
            });
            $last.addClass('animate animate-close');
        } else
            $('body').alterClass('section-*', 'section-'+ view.name);

        var headerData = _.clone(view.header||{});
        if ( _.isPlainObject(headerData) && _.isUndefined(headerData.title) )
            headerData.title = i18n.t('pages.'+view.name+'.title');
        header.getInstance().set(headerData);

        this.$el.prepend(view.el);
        //Marionette.Region.prototype.attachHtml.apply(this, arguments);
    }
});

module.exports = Region;
