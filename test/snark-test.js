const assert = require('assert');
const should = require('chai').should();
const proxyquire =  require('proxyquire')

var helperStub   =  { };
var snark;

describe('Snark', () => {
  describe('#reply()', () => {

    beforeEach(() => {
      helperStub.random = function () { return 0 };
      snark = proxyquire('../src/snark', { './helper': helperStub });
    });

    context('Good bot', () => {
      it('should reply', () => {
        snark.reply("good bot").should.equal("Good human");
      });
    });

    context('Bad bot', () => {
      it('should reply', () => {
        snark.reply("Bad bot!").should.equal("Bad carbon-based life form");
      });
    });

    context('I love you', () => {
      it('should reply', () => {
        snark.reply("i love you, bot").should.equal("What is love?");
      });
    });

    context('Thanks|Thank you', () => {
      it('should reply', () => {
        snark.reply("thank you, little bot!!!!").should.equal("Glad to be of service");
      });
    });

    context('Random message', () => {
      it('should not reply', () => {
        should.equal(snark.reply("Hello test"), undefined);
      });
    });
  });
});