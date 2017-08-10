const assert = require('assert');
const should = require('chai').should();

const formatter = require('../src/formatter');

describe('Formatter', () => {
  describe('#formatReply()', () => {

    context('< 50 char input', () => {
      it('should replace nonSI unit in text', () => {
        formatter.formatReply("Test foo", {"foo" : "bar"})
          .should
          .include("Test **bar**");
      });

      it('should replace from largest to smallest', () => {
        formatter.formatReply("Test foobar foo cat cat", {"foo" : "bar", "foobar" : "hey", "cat":"dog"})
          .should
          .include("Test **hey** **bar** **dog** **dog**");
      });
    });

    context('>= 50 character input', () => {
      it('should create tabular response', () => {
        formatter.formatReply("Hello there foo how are you meep merp Hello there!", {"foo" : "bar", "hi" : "hey"})
          .should
          .include("Original measurement | Metric measurement\n---|---\n")
          .and
          .include("foo|bar\n")
          .and
          .include("hi|hey\n");
      });
    });
  });
});