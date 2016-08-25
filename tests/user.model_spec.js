/*
 * Dumb test, just to have a working example in the context of this project
 */

var User = require('../modules/user/user.model.js');
var expect = require('chai').expect;

describe('User', function() {
    var myUser;

    before(function(){
        myUser = new User();
    });

    it('should have an empty string as a default name', function(){
        expect(myUser.get('username')).to.be.a('string');
        expect(myUser.get('username')).to.be.eql(''); // Test with ==
        expect(myUser.get('username')).to.be.equal(''); // Test with ===
    });

    it('should have a settable email', function(){
        myUser.set('email', 'skdjfh@skdjfh.fr');
        expect(myUser.get('email')).to.be.a('string');
        expect(myUser.get('email')).to.be.not.empty;
    });
});
