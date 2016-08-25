var $ = require('jquery');
var i18n = require('i18next-client');
var BaseTextFilter = require('../../node_modules/ag-grid/dist/lib/filter/textFilter');

var TextFilter = (function() {
  var TextFilter = function() {
    var self = this;
    this.createGui = function() {
      TextFilter.prototype.createGui.apply(this, arguments);
      var $eGui = $(self.eGui);
      var applyButton = $eGui.find("#applyButton");
      $(applyButton).addClass("btn btn-lg btn-block btn-filter");
      var apply = i18n.t('grid.apply');
      var $bottom = $('<div class="bottom clearfix" />');
      var clear = i18n.t('grid.clear');
      var $apply = $eGui.find("#applyPanel");
      applyButton.text(apply);

      var $cleanBtn = $('<button class="btn btn-link btn-xs pull-right" type="button"><span class="icon material-icon">close</span>' + clear + '</button>');
      $bottom.append($cleanBtn);
      $apply.append($bottom);

      $cleanBtn.click(this.onBtnCleanClick);
    };

    this.onBtnCleanClick = function() {
      var $eGui = $(self.eGui);
      var $input = $eGui.find('#filterText');
      $input.val(""); // chaine vide dans input
      self.onFilterChanged(); // on repercute la chaine vine
      self.filterChangedCallback();// on simule le click sur apply
      /* close popup*/
      if ( $('.ag-filter').length ) {
          $('body').trigger('click'); // simule un clique sur le body fermera le popup :p
      }
    };
  };

  TextFilter.prototype = new BaseTextFilter.TextFilter();

  return TextFilter;
})();

exports.TextFilter = TextFilter;
