'use strict';

var appConfig = require('../main/config');
var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var i18n = require('i18next-client');
var _ = require('lodash');
var $ = require('jquery');
var notify = require('../notifications/notify').notify;
var session = require('../main/session');

var Layout = Marionette.LayoutView.extend({
    name: 'device_settings',
    template: require('./device.tpl.html'),
    className: 'page scrollable device',
    events: {
        'click #settings-localize-me': 'onLocalizeMe',
        'reset form': 'onReset',
        'submit form': 'onSubmit',
        'change textarea,input,select,checkbox': 'onFormChange'
    },

    initialize: function(options) {
        this.model = options.model;
        if (!this.model.get('meta_data')) {
          this.model.set('meta_data', {});
        }


        /*this.initMetaData();
        this.initSensors();

        this.localisationSucceed = _.bind(this.localisationSucceed, this);
        this.localisationFailed = _.bind(this.localisationFailed, this);*/
    },

    initMetaData: function() {
      var self = this;
      if (!_.get(this.model.get('typeConfig'), 'settingsSettings.meta_data')) {
        var defaultsMetas = this.model.get('meta_data') ? _.keys(this.model.get('meta_data')) : [];
        _.set(this.model.get('typeConfig'), 'settingsSettings.meta_data', defaultsMetas);
      }
      this.model.get('typeConfig').settingsSettings.meta_data = _.map(this.model.get('typeConfig').settingsSettings.meta_data, function(meta) {
        if (_.isString(meta)) {
          meta = {
            name: meta
          };
        }
        _.defaultsDeep(meta, session.get('data_mapping_and_display')['meta_data_'+meta.name]);
        return meta;
      });
    },

    initSensors: function() {
      var self = this;
      var modelSensors = this.model.get('sensors');
      if (!modelSensors || !modelSensors.length) {
        _.set(this.model.get('typeConfig'), 'settingsSettings.sensors', []);
      }
      else if (!_.get(this.model.get('typeConfig'), 'settingsSettings.sensors')) {
        _.set(this.model.get('typeConfig'), 'settingsSettings.sensors', _.cloneDeep(modelSensors));
      }
      else {
        this.model.get('typeConfig').settingsSettings.sensors = _.reduce(this.model.get('typeConfig').settingsSettings.sensors, function(result, sensor, index) {
          if (_.isString(sensor)) {
            sensor = {
              name: sensor
            };
          }
          var sensorConfig = _.find(modelSensors, {name: sensor.name});
          if (sensorConfig) {
            result.push(_.defaultsDeep(sensor, sensorConfig));
          }
          return result;
        }, []);
      }
    },

    onFormChange: function() {
        window.underEdition = true;
    },

    serializeData: function() {
        var self = this;
        var alertType = this.model.get('alertType'),
            freq = this.model.get('collectionFrequency');
        return {
            id: this.model.id,
            name: this.model.get('name'),
            deviceAlertTracking: this.model.get('deviceAlertTracking') ? 'checked' : '',
            openData: this.model.get('openData') ? 'checked' : '',
            alertType: this.model.get('alertType'),
            freq10m: freq === 10 ? 'selected' : '',
            freq15m: freq === 15 ? 'selected' : '',
            freq30m: freq === 30 ? 'selected' : '',
            freq1h: freq === 60 ? 'selected' : '',
            freq2h: freq === 120 ? 'selected' : '',
            freq3h: freq === 180 ? 'selected' : '',
            freq6h: freq === 360 ? 'selected' : '',
            freq12h: freq === 720 ? 'selected' : '',
            freq24h: freq === 1440 ? 'selected' : '',
            lat: this.model.get('lat'),
            lng: this.model.get('lng'),
            metas: [],
            sensors: []
            /*metas: this.model.get('typeConfig').settingsSettings.meta_data.map(function(meta) {
                return {
                    name: meta.name,
                    value: _.get(self.model.get('meta_data'), meta.name, '')
                };
            }),
            sensors: this.model.get('typeConfig').settingsSettings.sensors.map(function(s) {
                return {
                    id: s.id,
                    name: i18n.t('cluster.data_mapping_and_display.' + s.name + '.label', {defaultValue: s.name}),
                    min: s.currentAlertThresholdMin,
                    max: s.currentAlertThresholdMax
                };
            }),
            dico: i18n.t('pages.device_settings', {
                returnObjectTrees: true
            })*/
        };
    },

    onReset: function(e) {
        window.underEdition = false;
        Backbone.history.loadUrl(Backbone.history.fragment);
    },

    onSubmit: function(e) {
        var self = this;
        if(e) {
            e.preventDefault();
        }
        this.$el.addClass('processing');

        var dfd;
        var formData = _.unserialize($(e.currentTarget).serialize());
        if (this.validate()) {
            dfd = this.saveData(formData).then(function() {
                return self.model.fetch();
            }).done(function() {
                notify('success', i18n.t('common.alert_success'), i18n.t('pages.device_settings.form_accepted'));
            }).fail(function() {
                notify('danger', i18n.t('common.alert_problem'), i18n.t('pages.device_settings.form_rejected'));
            }).always(function() {
                self.$el.removeClass('processing');
            });
        } else {
            this.$el.removeClass('processing');
            notify('warning', i18n.t('common.alert_problem'), i18n.t('pages.device_settings.form_invalid'));
        }
        return dfd;
    },

    saveData: function(formData) {
        var self = this;
        _.forEach(formData.meta_data, function(value, key) {
          var config = _.find(self.model.get('typeConfig').settingsSettings.meta_data, {name: key});
          if (_.get(config, 'type') == 'number') {
            formData.meta_data[key] = parseFloat(value.replace(',', '.'));
          }
        });
        var lat = formData.lat,
            lng = formData.lng,
            alertType = formData.alertType,
            data = {
                name: formData.name,
                lat: null,
                lng: null,
                deviceAlertTracking: formData.alertEnabled == 'on',
                openData: formData.openData == 'on',
                alertType: null,
                collectionFrequency: parseFloat(formData.frequency),
                activate: true,
                meta_data: formData.meta_data
            };
        if (lat !== '') {
            data.lat = parseFloat(lat.replace(',', '.'));
            data.lng = parseFloat(lng.replace(',', '.'));
        }
        if (alertType) {
            data.alertType = alertType;
        }
        this.model.set(data);

        this.model.get('typeConfig').settingsSettings.sensors.forEach(function(s) {

            var currentIndex = _.findIndex(self.model.get('sensors'), function(o) { return o.id == s.id; });

            var min = formData['alert_min_'+s.id],// self.$el.find('input[name^="alert_min"][data-id="'+s.id+'"]').val(),
                max = formData['alert_max_'+s.id];//self.$el.find('input[name^="alert_max"][data-id="'+s.id+'"]').val();

            self.model.get('sensors')[currentIndex].currentAlertThresholdMin = min !== '' ? parseFloat(min.replace(',', '.')) : null;
            self.model.get('sensors')[currentIndex].currentAlertThresholdMax = max !== '' ? parseFloat(max.replace(',', '.')) : null;

            s.currentAlertThresholdMin = min !== '' ? parseFloat(min.replace(',', '.')) : null;
            s.currentAlertThresholdMax = max !== '' ? parseFloat(max.replace(',', '.')) : null;
        });

        return $.ajax({
          method: 'PATCH',
          url: appConfig.apiBaseURL + '/devices/' + this.model.get('id'),
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify(this.model.attributes)
        }).done(function(){
            window.underEdition = false;
        });
        //return this.model.save(this.model.attributes, { patch: true });
    },

    validate: function() {
        var re = /^-?\d+((\.|,)\d+)?$/,
            valid = true;

        // Name
        var $name = this.$el.find('input[name="name"]');
        if ($name.val() === '') {
            $name.parent().parent().addClass('has-error');
            $name.parent().siblings('.help-block').text(i18n.t('pages.device_settings.form_rows.device_name.validation'));
            valid = false;
        } else {
            $name.parent().parent().removeClass('has-error');
            $name.parent().siblings('.help-block').text('');
        }

        // Lat/lon
        var $lat = this.$el.find('input[name="lat"]'),
            lat = $lat.val(),
            nlat = parseFloat(lat.replace(',', '.')),
            lon = this.$el.find('input[name="lng"]').val(),
            nlon = parseFloat(lon.replace(',', '.')),
            msg = '';
        $lat.parent().parent().parent().removeClass('has-error');
        $lat.parent().parent().siblings('.help-block').text('');
        if (lon === '' && lat === '') {
            msg = '';
        } else if (lat === '' || lon === '') {
            msg = i18n.t('pages.device_settings.form_rows.position.validation1');
        } else if (!re.test(lat) || !re.test(lon)) {
            msg = i18n.t('pages.device_settings.form_rows.position.validation2');
        } else if (nlat < -90 || nlat > 90 || nlon < -180 || nlon > 180) {
            msg = i18n.t('pages.device_settings.form_rows.position.validation2');
        }
        if (msg !== '') {
            $lat.parent().parent().parent().addClass('has-error');
            $lat.parent().parent().siblings('.help-block').text(msg);
            valid = false;
        }

        // Threshold
        this.$el.find('input[name^="alert_m"]').each(function(i, input) {
            var $input = $(input),
                val = $input.val();
            $input.parent().parent().removeClass('has-error');
            $input.parent().siblings('.help-block').text('');
            if (val !== '' && !re.test(val)) {
                $input.parent().parent().addClass('has-error');
                $input.parent().siblings('.help-block').text(i18n.t('pages.device_settings.form_rows.sensors.validation'));
                valid = false;
            }
        });

        return valid;
    },

    localisationSucceed: function(position) {
        this.$el.find('input[name="lat"]').val(position.coords.latitude).prop('disabled', false);
        this.$el.find('input[name="lng"]').val(position.coords.longitude).prop('disabled', false);
    },

    localisationFailed: function(error) {
        this.$el.find('input[name="lat"], input[name="lng"]').prop('disabled', false);
        notify('warning', i18n.t('common.alert_problem'), i18n.t('geoloc.failure'));
    },

    onLocalizeMe: function(e) {
        e.preventDefault();
        if (!('geolocation' in navigator)) {
            notify('warning', i18n.t('common.alert_problem'), i18n.t('geoloc.unavailable'));
            return;
        }
        this.$el.find('input[name="lat"], input[name="lng"]').prop('disabled', true);
        navigator.geolocation.getCurrentPosition(
            this.localisationSucceed,
            this.localisationFailed
        );
    },

    onShow: function(options) {
        this.$el.addClass('loading');
        var self = this;
        this.$el.find('input[type="checkbox"]').bootstrapSwitch();
        this.$el.find('input[type="checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
            self.onFormChange();
        });
    }

});

module.exports = Layout;
