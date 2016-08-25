/*
 * dependencies
 */
var expect = require('chai').expect;

describe('i18n-client', function() {
  
    var i18n = require('i18next-client');

    it('should exist', function() {
        expect(i18n).to.be.defined;
    });

    it('should init properly with language value', function(){
      var userLanguage = 'en';

      i18n.init({
        getAsync: false,
        lng: userLanguage,
        fallbackLng: false,
        useCookie: false,
        resGetPath: '/data/locales/__lng__/__ns__.json'
      });
      
      expect(i18n.lng()).to.be.equal('en');

    });
});

