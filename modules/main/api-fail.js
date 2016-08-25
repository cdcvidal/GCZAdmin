'use strict';

var notify = require('../notifications/notify').notify;
var t = require('i18next-client').t;

module.exports = function() {
    notify('danger', t('common.alert_problem'), t('API.fetchFailed'));
};
