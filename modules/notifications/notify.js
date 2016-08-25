'use strict';

var $ = require('jquery');

var $list = $('<ul class="notification-list">');

module.exports = {
    init: function () {
        $('body').append($list);
    },
    notify: function(type, title, message, delay) {
        type = type || 'danger';
        title = title || 'Error';
        message = message || 'An error occured';
        delay = delay !== void 0 ? delay : 7;

        var $notif = $('<li class="alert alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button><strong></strong> <span class="message"></span></li>');

        $notif.addClass('alert-' + type);
        $notif.find('strong').text(title);
        $notif.find('span.message').text(message);
        $list.append($notif);

        if (typeof(delay) === 'number' && delay > 0) {
            $notif.slideDown().delay(delay*1000).slideUp(400, function () {$(this).remove();});
        } else {
            $notif.slideDown();
        }
    }
};
