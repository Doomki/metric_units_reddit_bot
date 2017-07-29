const assert = require('assert');
const should = require('chai').should();

const converter = require('../converter');

describe('Converter', () => {
  describe('#convertString()', () => {

    context('Has temperature to convert', () => {
      it('should convert while keeping context', () => {
        converter.shouldConvert("It's 32F outside").should.equal(true);
        converter.convertString("It's 32F outside").should.equal("It's 0C outside");
      });

      it('should convert without a degree symbol (32F)', () => {
        converter.shouldConvert("32F").should.equal(true);
        converter.convertString("32F").should.equal("0C");
      });

      it('should convert with a degree symbol (32˚F or 32°F)', () => {
        converter.shouldConvert("32˚F").should.equal(true);
        converter.convertString("32˚F").should.equal("0˚C");

        converter.shouldConvert("32°F").should.equal(true);
        converter.convertString("32°F").should.equal("0°C");
      });

      it('should convert negative temperatures (-32F)', () => {
        converter.shouldConvert("-32F").should.equal(true);
        converter.convertString("-32F").should.equal("-36C");
      });

      it('should convert with a space (32 F)', () => {
        converter.shouldConvert("32 F").should.equal(true);
        converter.convertString("32 F").should.equal("0 C");
      });

      it('should convert negative temperatures with a space and degree symbol (-32 ˚F)', () => {
        converter.shouldConvert("-32 ˚F").should.equal(true);
        converter.convertString("-32 ˚F").should.equal("-36 ˚C");
      });
    });

    context('No temperature to convert', () => {
      it('should not convert celcius', () => {
        converter.shouldConvert("It's 32˚C outside").should.equal(false);
      });

      it('should not convert mid-string', () => {
        converter.shouldConvert("A7F").should.equal(false);
      });
    });

  });
});