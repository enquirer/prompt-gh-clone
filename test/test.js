'use strict';

require('mocha');
var isTravis = process.env.CI || process.env.TRAVIS;
var del = require('delete');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var clone = require('..');
var fixtures = path.join.bind(path, __dirname, 'fixtures');

describe('prompt-gh-clone', function() {
  it('should export a function(sanity test)', function() {
    assert.equal(typeof clone, 'function');
  });

  it('should clone a repository', function(cb) {
    if (isTravis) return this.skip();
    this.timeout(10000);
    clone({dest: fixtures('micromatch')}, function(err) {
      if (err) {
        cb(err);
        return;
      }
      assert(fs.existsSync(fixtures('micromatch')));
      del(fixtures(), cb);
    })
      .on('ask', function(prompt) {
        prompt.rl.emit('line', 'jonschlinkert/micromatch');
        setTimeout(function() {
          prompt.rl.input.emit('keypress', '\n');
        }, 5);
      });
  });

  it('should throw an error when callback is not passed', function() {
    assert.throws(function() {
      clone();
    });
  });
});
