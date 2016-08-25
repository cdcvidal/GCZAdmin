var expect = require('chai').expect;
var should = require('chai').should();
var assert = require('chai').assert;
var moment = require('moment');


var FilterToOperator = require('../modules/API_utilities/filter_to_operator.js');

describe('FilterToOperator', function(){

    it('should exist', function() {
      var filterToOperator = new FilterToOperator();
      should.exist(filterToOperator);
    });

    it('should return operator $regex with filter value contains and empty type of Column', function() {
      var typeCol = '',
          valueOperator = 1 ,
          valueInput= 'foo' ,
          colName = '';
      var filterToOperator = new FilterToOperator({typeCol: typeCol , valueOperator:valueOperator , valueInput:valueInput ,colName: colName});
      expect(filterToOperator.switchCase()).to.contain('[$regex]');
      expect(filterToOperator.switchCase()).to.be.equal('[$regex]=(?i)'+String(valueInput));
      filterToOperator.switchCase().should.be.a('string');
    });

    it('should return operator $eq with filter value equals and type of Column number', function() {
      var typeCol = 'number',
          valueOperator = 1 ,
          valueInput= 1234 ,
          colName = '';
      var filterToOperator = new FilterToOperator({typeCol: typeCol , valueOperator:valueOperator , valueInput:valueInput ,colName: colName});
      expect(filterToOperator.switchCase()).to.contain('[$eq]');
      expect(filterToOperator.switchCase()).to.be.equal('[$eq]='+String(valueInput));
      filterToOperator.switchCase().should.be.a('string');
    });

    it('should return operator $gt with filter date from and type of Column date', function() {
      var typeCol = 'date',
          valueOperator = 1 ,
          valueInput= {dateFrom: new Date(2004,3,20), dateTo: ''} ,
          colName = '';

      var theFormat = "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]";

      var filterToOperator = new FilterToOperator({typeCol: typeCol , valueOperator:valueOperator , valueInput:valueInput ,colName: colName});
      expect(filterToOperator.switchCase()).to.contain('[$gt]');
      expect(filterToOperator.switchCase()).to.be.equal('[$gt]='+String(moment(valueInput.dateFrom).utc().format(theFormat)));
      filterToOperator.switchCase().should.be.a('string');
    });

    it('should return operator $lt with filter date to and type of Column date', function() {
      var typeCol = 'date',
          valueOperator = 1 ,
          valueInput= {dateFrom: '', dateTo: new Date(2004,3,20)} ,
          colName = '';

      var theFormat = "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]";

      var filterToOperator = new FilterToOperator({typeCol: typeCol , valueOperator:valueOperator , valueInput:valueInput ,colName: colName});
      expect(filterToOperator.switchCase()).to.contain('[$lt]');
      expect(filterToOperator.switchCase()).to.be.equal('[$lt]='+String(moment(valueInput.dateTo).add(1, 'day').utc().format(theFormat)));
      filterToOperator.switchCase().should.be.a('string');
    });

    it('should return operator $gt and $lt with filter value date range and type of Column date', function() {
      var typeCol = 'date',
          valueOperator = 1 ,
          valueInput= {dateFrom: new Date(2004,1,20), dateTo: new Date(2004,3,20)} ,
          colName = '';

      var theFormat = "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]";

      var filterToOperator = new FilterToOperator({typeCol: typeCol , valueOperator:valueOperator , valueInput:valueInput ,colName: colName});
      expect(filterToOperator.switchCase()).to.contain('[$gt]');
      expect(filterToOperator.switchCase()).to.contain('[$lt]');
      expect(filterToOperator.switchCase()).to.be.equal('[$gt]='+String(moment(valueInput.dateFrom).utc().format(theFormat))+"&selector["+colName+"][$lt]="+String(moment(valueInput.dateTo).add(1, 'day').utc().format(theFormat)));
      filterToOperator.switchCase().should.be.a('string');
    });

    it('should return operator $ne with filter value not equals and type of Column number', function() {
      var typeCol = 'number',
          valueOperator = 2 ,
          valueInput= 1234 ,
          colName = '';
      var filterToOperator = new FilterToOperator({typeCol: typeCol , valueOperator:valueOperator , valueInput:valueInput ,colName: colName});
      expect(filterToOperator.switchCase()).to.contain('[$ne]');
      expect(filterToOperator.switchCase()).to.be.equal('[$ne]='+String(valueInput));
      filterToOperator.switchCase().should.be.a('string');
    });

    it('should return operator $regex with filter value equals and type of Column text', function() {
      var typeCol = 'text',
          valueOperator = 2 ,
          valueInput= 'foo',
          colName = '';
      var filterToOperator = new FilterToOperator({typeCol: typeCol , valueOperator:valueOperator , valueInput:valueInput ,colName: colName});
      expect(filterToOperator.switchCase()).to.contain('[$regex]');
      expect(filterToOperator.switchCase()).to.be.equal('[$regex]=(?i)^'+String(valueInput)+"$");
      filterToOperator.switchCase().should.be.a('string');
    });

    it('should return operator $lt with filter value less than and type of Column number', function() {
      var typeCol = 'number',
          valueOperator = 3 ,
          valueInput= 1234 ,
          colName = '';
      var filterToOperator = new FilterToOperator({typeCol: typeCol , valueOperator:valueOperator , valueInput:valueInput ,colName: colName});
      expect(filterToOperator.switchCase()).to.contain('[$lt]');
      expect(filterToOperator.switchCase()).to.be.equal('[$lt]='+String(valueInput));
      filterToOperator.switchCase().should.be.a('string');
    });

    it('should return operator $regex with filter value not equals and type of Column text', function() {
      var typeCol = 'text',
          valueOperator = 3 ,
          valueInput= 'foo',
          colName = '';
      var filterToOperator = new FilterToOperator({typeCol: typeCol , valueOperator:valueOperator , valueInput:valueInput ,colName: colName});
      expect(filterToOperator.switchCase()).to.contain('[$regex]');
      expect(filterToOperator.switchCase()).to.be.equal('[$regex]=(?i)^(?!.*'+String(valueInput)+").*$");
      filterToOperator.switchCase().should.be.a('string');
    });

    it('should return operator $lte with filter value less than or equals and type of Column number', function() {
      var typeCol = 'number',
          valueOperator = 4 ,
          valueInput= 1234 ,
          colName = '';
      var filterToOperator = new FilterToOperator({typeCol: typeCol , valueOperator:valueOperator , valueInput:valueInput ,colName: colName});
      expect(filterToOperator.switchCase()).to.contain('[$lte]');
      expect(filterToOperator.switchCase()).to.be.equal('[$lte]='+String(valueInput));
      filterToOperator.switchCase().should.be.a('string');
    });

    it('should return operator $regex with filter value start with and type of Column text', function() {
      var typeCol = 'text',
          valueOperator = 4 ,
          valueInput= 'foo',
          colName = '';
      var filterToOperator = new FilterToOperator({typeCol: typeCol , valueOperator:valueOperator , valueInput:valueInput ,colName: colName});
      expect(filterToOperator.switchCase()).to.contain('[$regex]');
      expect(filterToOperator.switchCase()).to.be.equal('[$regex]=(?i)^'+String(valueInput));
      filterToOperator.switchCase().should.be.a('string');
    });

    it('should return operator $gt with filter value greater than and type of Column number', function() {
      var typeCol = 'number',
          valueOperator = 5 ,
          valueInput= 1234 ,
          colName = '';
      var filterToOperator = new FilterToOperator({typeCol: typeCol , valueOperator:valueOperator , valueInput:valueInput ,colName: colName});
      expect(filterToOperator.switchCase()).to.contain('[$gt]');
      expect(filterToOperator.switchCase()).to.be.equal('[$gt]='+String(valueInput));
      filterToOperator.switchCase().should.be.a('string');
    });

    it('should return operator $regex with filter value end with and type of Column text', function() {
      var typeCol = 'text',
          valueOperator = 5 ,
          valueInput= 'foo',
          colName = '';
      var filterToOperator = new FilterToOperator({typeCol: typeCol , valueOperator:valueOperator , valueInput:valueInput ,colName: colName});
      expect(filterToOperator.switchCase()).to.contain('[$regex]');
      expect(filterToOperator.switchCase()).to.be.equal('[$regex]=(?i)'+String(valueInput)+"$");
      filterToOperator.switchCase().should.be.a('string');
    });

    it('should return operator $gte with filter value greater than or equals and type of Column number', function() {
      var typeCol = 'number',
          valueOperator = 6 ,
          valueInput= 1234 ,
          colName = '';
      var filterToOperator = new FilterToOperator({typeCol: typeCol , valueOperator:valueOperator , valueInput:valueInput ,colName: colName});
      expect(filterToOperator.switchCase()).to.contain('[$gte]');
      expect(filterToOperator.switchCase()).to.be.equal('[$gte]='+String(valueInput));
      filterToOperator.switchCase().should.be.a('string');
    });

});
