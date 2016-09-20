var  _ = require('lodash');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var $ = require('jquery');
var i18n = require('i18next-client');
var Router = require('../routing/router');
var AgGrid = require('ag-grid');
var CustomTextFilter = require('./aggrid_custom_text_filter');
var CustomNumberFilter = require('./aggrid_custom_number_filter');
var CustomDateFilter = require('./aggrid_custom_date_filter');
var FilterToOperator = require('../API_utilities/filter_to_operator');

var moment = require('moment');

var utils_1 = require('../../node_modules/ag-grid/dist/lib/utils');
var LINE_SEPARATOR = '\r\n';

var Layout = Marionette.LayoutView.extend({
  template: require('./grid.tpl.html'),
  className: 'page devices margin-md',

  initialize: function(options) {
    var self = this;
    this.options = options;

    var columnDefs = this.model.get('columnDefs');
    _.forEach(columnDefs, function(col, i) {
      _.defaults(col, {
        headerName: !col.field ? '' : i18n.t('grid.'+self.model.get('name')+'.columns.'+col.field, {defaultValue: col.field}),
        filter: col.type == 'number' ?  CustomNumberFilter.NumberFilter : col.type == 'date' ? CustomDateFilter.DateFilter : CustomTextFilter.TextFilter,
        filterParams: {
          apply: true,
          newRowsAction: 'keep'
        },
        minWidth: col.type == 'date' ? 200 : 100
      });
    });

    this.gridOptions = {
      columnDefs: columnDefs,
      enableSorting: true,
      enableFilter: true,
      enableServerSideSorting: true,
      enableServerSideFilter: true,
      enableColResize: true,
      rowHeight: 30,
      headerHeight: 40,
      overlayLoadingTemplate: '',
      rowModelType : 'virtual',
      sortingOrder: ['desc','asc'],
      suppressScrollLag: true,
      headerCellTemplate:
        '<div class="ag-header-cell">'+
        '  <div id="agResizeBar" class="ag-header-cell-resize"></div>'+
        '  <span id="agMenu" class="ag-header-icon ag-header-cell-menu-button"><span class="glyphicon glyphicon-align-right glyphicon-filter"></span></span>'+
        '  <div id="agHeaderCellLabel" class="ag-header-cell-label">'+
        '    <span id="agSortAsc" class="ag-header-icon ag-sort-ascending-icon"><span class="icon material-icon">arrow_drop_up</span></span>'+
        '    <span id="agSortDesc" class="ag-header-icon ag-sort-descending-icon"><span class="icon material-icon">arrow_drop_down</span></span>'+
        '    <span id="agNoSort" class="ag-header-icon ag-sort-none-icon"></span>'+
        '    <span id="agFilter" class="ag-header-icon ag-filter-icon"></span>'+
        '    <span id="agText" class="ag-header-cell-text"></span>'+
        '  </div>'+
        '</div>',
      localeTextFunc: function(key, defaultValue) {
          var gridKey = 'grid.' + key;
          var value = i18n.t(gridKey, {defaultValue: defaultValue});
          return value;
      }
    };
  },

  onShow: function() {
    var self = this;
    this.displayGrid();
    this.onResize = _.debounce( function() {
      self.gridOptions.api.sizeColumnsToFit();
    }, 100);
    $(window).on('resize', self.onResize);
  },

  focusFilter: function(e){
    setTimeout(function(){
      $(e.currentTarget).parent().addClass('current-filter');
    }, 0);
  },

  applyFilterByKey:function(e){
    var value = $('#filterText').value;
    if (e.keyCode === 13)
      this.gridOptions.api.onFilterChanged(value);
  },

  displayGrid: function() {
    var self = this;
    this.grid = new AgGrid.Grid(this.$el.find('.ag-grid-container')[0], this.gridOptions);

    this.gridOptions.api.sizeColumnsToFit();
    this.gridOptions.api.setDatasource({
      rowCount: null,
      pageSize : 300,
      overflowSize: 10,
      maxConcurrentRequests: 2,
      getRows: function(params) {
        var me = this;
        console.log(params);
        var sortModel = params.sortModel[0] || self.model.get('sortModel');
        var queryParams = '';
        if (sortModel) {
          queryParams = 'sort['+sortModel.colId+']='+sortModel.sort;
          //_.set(queryParams, 'sort.'+sortModel.colId, sortModel.sort);
        }
        queryParams += self.generateFilterQuery(params.filterModel);
        self.model.fetch({
          data: queryParams,
          success: function(model, response, options) {
            console.log('fetch devices success', response);
            var lastRow = -1;
            if (response.length < me.pageSize) {
              lastRow = params.startRow + response.length;
            }
            params.successCallback(response, lastRow);
          },
          error: function(model, response, options){
            console.log('fetch devices error', response);
          }
        });
      }
    });
  },

  generateFilterQuery: function(filterModel) {
      if (!filterModel) {
        return '';
      }
      var query = "";
      //var config = this.data_mapping_and_display;
      var options = {};
      for (var colId in filterModel) {
        console.log(colId, this.gridOptions.columnApi.getColumn(colId));
        var filterData = filterModel[colId];
        var col = this.gridOptions.columnApi.getColumn(colId);
        if (!col) {
          continue;
        } else if (col.colDef.type && filterData.filter.dateFrom === '' && filterData.filter.dateTo === '') {
          continue;
        }
        query += '&selector['+colId+']';
        var filterToOperator = new FilterToOperator({
          typeCol: col.colDef.type,
          valueOperator: filterData.type,
          valueInput: filterData.filter,
          colName: colId
        });
        query += filterToOperator.switchCase();
      }
      return query;
    },

  onDestroy: function(){
    $(window).off('resize', this.onResize);
  }
});

module.exports = Layout;
