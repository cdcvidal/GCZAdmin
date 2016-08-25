var $ = require('jquery');
var moment = require('moment');
var i18n = require('i18next-client');

var DateFilter = (function() {
  var DateFilter = function () {

    DateFilter.prototype.init = function (params) {
      var apply = i18n.t('grid.apply');
      var clear = i18n.t('grid.clear');
      var placeholderFrom = i18n.t('grid.startDate');
      var placeholderTo =  i18n.t('grid.lastDate');

      this.eGui = document.createElement('div');
      this.eGui.innerHTML =
      '<div class="js-datefrom">'+
      '<input type="text" class="ag-filter-filter js-datefrom-input" name="from" placeholder="'+placeholderFrom+'">'+
      '</div>'+
      '<div class="js-dateto">'+
      '<input type="text" class="ag-filter-filter js-dateto-input"name="to" placeholder="'+placeholderTo+'">'+
      '</div>'+
      '<div class="ag-filter-apply-panel" id="applyPanel">' +
      '<p class="help">'+ i18n.t('grid.invalidDateRange') +'</p>' +
      '<button class="btn btn-lg btn-block btn-filter" type="button" id="applyButton">'+apply+'</button>' +
      '<div class="bottom clearfix" />'+
      '<button class="btn btn-link btn-xs pull-right" type="button" id="cleanBtn"><span class="icon material-icon">close</span>' + clear + '</button>'+
      '</div>'+
      '</div>';
      var $eGui = $(this.eGui);

      this.dateFrom = this.eGui.querySelector('.js-datefrom-input');
      this.dateTo = this.eGui.querySelector('.js-dateto-input');

      this.cleanBtn = this.eGui.querySelector('#cleanBtn');
      this.cleanBtn.addEventListener('click', this.dateClean.bind(this));
      this.filterDate = null;
      this.applyActive = true;
      this.filterChangedCallback = params.filterChangedCallback;
      this.filterModifiedCallback = params.filterModifiedCallback;
      this.valueGetter = params.valueGetter;

      this.dateFormat = i18n.t('date_format.short');

      this.createGui();
    };

    DateFilter.prototype.dateClean = function () {
      this.dateFrom.value = "";
      this.dateTo.value = "";

      this.onFilterChanged();
      this.filterChangedCallback();
      if ( $('.ag-filter').length ) {
        $('body').trigger('click'); // simule un clique sur le body fermera le popup :p
      }
    };

    DateFilter.prototype.afterGuiAttached = function(params) {
      var self = this;

      $( this.dateFrom ).datetimepicker({
        locale: i18n.lng(),
        format: this.dateFormat,
        useCurrent: false
      });

      $( this.dateTo ).datetimepicker({
        locale: i18n.lng() ,
        format: this.dateFormat,
        useCurrent: false
      });

      $(this.dateFrom).on("dp.change", function (e) {
        self.onFilterChanged();
        //$(self.dateTo).data("DateTimePicker").minDate(e.date);
      });
      $(this.dateTo).on("dp.change", function (e) {
        self.onFilterChanged();
        //$(self.dateFrom).data("DateTimePicker").maxDate(e.date);
      });
    };

    DateFilter.prototype.isFilterValid = function() {
      var from = $(this.dateFrom).data("DateTimePicker").date();
      var to = $(this.dateTo).data("DateTimePicker").date();
      var isValid = (!from || !to) || from <= to;
      var $container = $(this.eGui).parent();
      if (isValid) {
        $container.removeClass('has-error');
      } else {
        $container.addClass('has-error');
      }

      return isValid;
    };

    DateFilter.prototype.onFilterChanged = function () {
      var dateFrom = null;
      var dateTo = null;
      if(this.dateFrom.value !== ""){
        dateFrom = moment(this.dateFrom.value, this.dateFormat).toDate();
      }
      else
      dateFrom = "";
      if(this.dateTo.value !== ""){
        dateTo = moment(this.dateTo.value, this.dateFormat).toDate();
      }
      else
      dateTo = "";
      this.filterDate = {
        "dateFrom" : dateFrom,
        "dateTo" : dateTo
      };
      this.filterChanged();
    };
    DateFilter.prototype.filterChanged = function () {
      this.filterModifiedCallback();
      if (!this.applyActive) {
        this.filterChangedCallback();
      }
    };

    DateFilter.prototype.getGui = function () {
      return this.eGui;
    };

    DateFilter.prototype.createGui = function () {
      this.setupApply();
    };

    DateFilter.prototype.isFilterActive = function () {
      return this.filterDate && (this.filterDate.dateFrom || this.filterDate.dateTo);
    };

    DateFilter.prototype.setupApply = function () {
      var _this = this;
      if (this.applyActive) {
        this.eApplyButton = this.eGui.querySelector('#applyButton');
        this.eApplyButton.addEventListener('click', function () {
          if (_this.isFilterValid()) {
            _this.filterChangedCallback();
          }
        });
      }
    };

    DateFilter.prototype.getApi = function() {
      var that = this;
      return {
        getModel: function() {
          if (that.isFilterActive()) {
            return {
              type: 1,
              filter: that.filterDate
            };
          }
          else {
            return null;
          }
        },
        setModel: function(model) {
          if(model){
            this.setType(model.type);
            this.setFilter(model.filter);
          }
          else this.setFilter(null);
        }
      };
    };
  };
  return DateFilter;
})();

exports.DateFilter = DateFilter;
