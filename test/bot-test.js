const assert = require('assert');
const should = require('chai').should();
const proxyquire =  require('proxyquire')

describe('Bot', () => {
  let bot;

  //Network
  let refreshTokenCount;
  let getRedditCommentsParam;
  let getRedditCommentsReturnValue;
  let postCommentId;
  let postCommentBody;
  let getUnreadMessagesReturnValue;
  let getUnreadMessagesCalled;
  let markAllMessagesAsReadCalled;

  //Helper
  let commentFunction;
  let commentSeconds;
  let privateMessageFunction;
  let privateMessageSeconds;

  //Converter
  let conversionCommentParam;
  let conversionReturnValue;

  //Replier
  let replyCommentParam;
  let replyConversionParam;
  let replyReturnValue;
  let replyStopMessage = "please block me";

  //Personality
  let personalityMessageParam;
  let personalityRetunValue;

  beforeEach(() => {
    let helperStub = {};
    let networkStub = {};
    let converterStub = {};
    let replyStub = {};
    let personalityStub = {};

    //Network
    refreshTokenCount = 0;
    networkStub.refreshToken = () => { 
      refreshTokenCount = refreshTokenCount + 1;
    };
    getRedditCommentsParam = undefined;
    networkStub.getRedditComments = (param) => { 
      getRedditCommentsParam = param;
      return getRedditCommentsReturnValue;
    };
    postCommentId = undefined;
    postCommentBody = undefined;
    networkStub.postComment = (id, body) => {
      postCommentId = id;
      postCommentBody = body;
    };
    getUnreadMessagesCalled = false;
    getUnreadMessagesReturnValue = undefined;
    networkStub.getUnreadMessages = () => {
      getUnreadMessagesCalled = true;
      return getUnreadMessagesReturnValue
    };
    markAllMessagesAsReadCalled = false;
    networkStub.markAllMessagesAsRead = () => {
      markAllMessagesAsReadCalled = true;
    };

    //Helper
    commentFunction = undefined;
    commentSeconds = undefined;
    privateMessageFunction = undefined;
    privateMessageSeconds = undefined;
    helperStub.setIntervalSafely = (f, seconds) => { 
      if (commentFunction === undefined) {
        commentFunction = f;
        commentSeconds = seconds;
      } else {
        privateMessageFunction = f;
        privateMessageSeconds = seconds;
      }
    };

    //Converter
    conversionCommentParam = undefined;
    conversionReturnValue = undefined;
    converterStub.conversions = (comment) => {
      conversionCommentParam = comment;
      return conversionReturnValue;
    };

    //Replier
    replyCommentParam = undefined;
    replyConversionParam = undefined;
    replyReturnValue = undefined;
    replyStub.formatReply = (comment, conversions) => {
      replyCommentParam = comment;
      replyConversionParam = conversions;
      return replyReturnValue;
    };
    replyStub.stopMessage = replyStopMessage;

    //Personality
    personalityMessageParam = undefined;
    personalityRetunValue = undefined;
    personalityStub.reply = (message) => {
      personalityMessageParam = message;
      return personalityRetunValue;
    };

    bot = proxyquire('../src/bot', { 
      './helper': helperStub,
      './network' : networkStub,
      './converter' : converterStub,
      './reply_maker' : replyStub,
      './analytics' : { trackConversion: (x) => x,
                        trackPersonality: (x) => x,
                        trackUnsubscribe: (x) => x },
      './personality' : personalityStub
    });
  });

  describe('on load', () => {
    it('should refresh network token', () => {
      refreshTokenCount.should.equal(1);
    });
  });

  describe('conversions', () => {
    it('should trigger every 2 seconds', () => {
      commentSeconds.should.equal(2);
    });

    context('on trigger', () => {
      it('should get reddit comments to r/all', () => {
        commentFunction();
        getRedditCommentsParam.should.equal("all");
      });

      context('given valid comment', () => {
        let comment;

        beforeEach(() => {
          comment = {
            'body': 'comment 1',
            'author': '',
            'id': '123',
            'postTitle': '',
            'link': '',
            'subreddit': '',
            'timestamp' : ''
          }
          getRedditCommentsReturnValue = [comment];
          conversionReturnValue = {"1" : "2"};
        });

        it('should create conversion', () => {
          commentFunction();
          conversionCommentParam.should.equal(comment);
        });

        context('given valid conversion', () => {
          beforeEach(() => {
            replyReturnValue = 'comment 1 converts to comment 2'
          });

          it('should create reply', () => {
            commentFunction();
            replyCommentParam.should.equal(comment);
            replyConversionParam.should.equal(conversionReturnValue);
          });

          it('should post reply', () => {
            commentFunction();
            postCommentId.should.equal('123');
            postCommentBody.should.equal(replyReturnValue);
          });
        });
      });
    });
  });

  describe('private messages', () => {
    it('should trigger every 60 seconds', () => {
      privateMessageSeconds.should.equal(60);
    });

    context('on trigger', () => {
      it('should refresh network token', () => {
        privateMessageFunction();
        refreshTokenCount.should.equal(2);
      });

      it('should get all unread messages', () => {
        privateMessageFunction();
        getUnreadMessagesCalled.should.equal(true);
      });

      context('valid comment reply', () => {
        beforeEach(() => {
          let commentReply = {
            'kind' : 't1',
            'data' : {
              'body' : 'good bot',
              'name' : '456',
              'subreddit' : '',
              'subject' : ''
            }
          };
          getUnreadMessagesReturnValue = [commentReply];
        });

        it('should mark all messages as read', () => {
          privateMessageFunction();
          markAllMessagesAsReadCalled.should.equal(true);
        });

        context('comment reply', () => {
          it('should make sassy response', () => {
            personalityRetunValue = 'sassy response';
            privateMessageFunction();
            personalityMessageParam['body'].should.equal('good bot');
            postCommentId.should.equal('456');
            postCommentBody.should.equal(personalityRetunValue);
          });
        });
      });

      context('valid comment reply', () => {
        beforeEach(() => {
          let directMessage = {
            'kind' : 't4',
            'data' : {
              'body' : '',
              'name' : '789',
              'subreddit' : '',
              'subject' : 'stop'
            }
          };
          getUnreadMessagesReturnValue = [directMessage];
        });

        context('direct message with subject stop', () => {
          it('should ask the user to block the bot', () => {
            privateMessageFunction();
            postCommentId.should.equal('789');
            postCommentBody.should.equal(replyStopMessage);
          });
        });
      });
    });
  });
});
