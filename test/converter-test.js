const assert = require('assert');
const should = require('chai').should();

const converter = require('../converter');

function testConvertTrue(entireInput, expectedConversion, inputConversion) {
  converter.shouldConvert(entireInput).should.equal(true);

  if (inputConversion === undefined) {
    inputConversion = entireInput;
  }

  var expected = {};
  expected[inputConversion] = expectedConversion;

  const actual = converter.convertString(entireInput);
  actual.should.deep.equal(expected);
}

function testConvertFalse(input) {
  converter.shouldConvert(input).should.equal(false);
}

describe('Converter', () => {
  describe('#convertString()', () => {

    context('Has distance to convert', () => {
      it('should convert text with context', () => {
        testConvertTrue("I would walk 10001 miles", "16095 km", "10001 miles");
        testConvertTrue("I would walk 10001mi", "16095 km", "10001mi");
      });

      it('should convert distances less than 5 miles with more accuracy', () => {
        testConvertTrue("2 mi", "3.2 km");
      });

      it('should convert decimal miles with similar precision', () => {
        testConvertTrue("6.789miles", "10.926 km");
      });

      it('should convert numbers with commas', () => {
        testConvertTrue("999,123,456 miles", "1,607,933,339 km");
      });

      it('should convert comma and decimal numbers', () => {
        testConvertTrue("around 1,000.4mph or so", "1,610.0 km/h", "1,000.4mph");
      });
    });
    
    context('Has no distance to convert', () => {
      it('should not convert with no number', () => {
        testConvertFalse("some miles");
      });

      it('should not convert kilometers', () => {
        testConvertFalse("800 kilometers");
        testConvertFalse("800km");
      });

      it('should not convert deformed numbers', () => {
        testConvertFalse("1,10,2 miles");
      });

      it('should not convert mid-word', () => {
        testConvertFalse("catch22 microscope");
        testConvertFalse("catch 22 microscope");
        testConvertFalse("catch22 mi croscope");
        testConvertFalse("catch22microscope");
      });
    });

    context('Has temperature to convert', () => {
      it('should convert with context', () => {
        testConvertTrue("It's 32°F outside", "0°C", "32°F");
      });

      it('should convert with a degree symbol (32°F)', () => {
        testConvertTrue("32°F", "0°C");
      });

      it('should convert negative temperatures (-32°F)', () => {
        testConvertTrue("-32°F", "-36°C");
      });


      it('should convert with a space (32 °F)', () => {
        testConvertTrue("32 °F", "0°C");
      });

      it('should convert Fahrenheit', () => {
        testConvertTrue("32 Fahrenheit", "0°C");
      });

      it('should convert negative temperatures degrees fahrenheit', () => {
        testConvertTrue("-32 degrees fahrenheit", "-36°C");
      });

      it('should convert temperature ranges', () => {
        testConvertTrue("32 - -32°F", "0 to -36°C");
        testConvertTrue("It is 32-32°F right now", "0 to 0°C", "32-32°F")
      });
    });

    context('No temperature to convert', () => {
      it('should not convert celcius', () => {
        testConvertFalse("It's 32°C outside");
      });
      
      it('should not convert without a °', () => {
        testConvertFalse("I am 23F");
      });

      it('should not convert with special characters', () => {
        testConvertFalse("It's cold (-40°F) outside");
        testConvertFalse("It's about ~32°F outside");
        testConvertFalse("It's >32°F outside");
        testConvertFalse("It's <32°F outside");
      })

      it('should not convert mid-string', () => {
        testConvertFalse("A7F");
        testConvertFalse("8FF");
        testConvertFalse("A-8FF");
        testConvertFalse("hey-8F-F");
      });
    });

    context('Has distance and temperature', () => {
      it('should convert all units in a string', () => {
        converter.shouldConvert("32 °F, -32°F, 1 mile").should.equal(true);
        converter.convertString("32 °F, -32°F, 1 mile").should.deep.equal({"32 °F": "0°C", "-32°F" : "-36°C", "1 mile" : "1.6 km"});
      });
    })
  });
});