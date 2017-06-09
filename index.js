'use strict';

var path = require('path');
var Text = require('prompt-text');
var clone = require('gh-clone');

module.exports = function(options, cb) {
  var opts = Object.assign({}, options);
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (typeof cb !== 'function') {
    throw new TypeError('expected callback to be a function');
  }

  var question = Object.assign({
    name: 'clone',
    message: 'GitHub repo to clone? (owner/name)'
  }, opts);

  var prompt = new Text(question);

  setImmediate(function() {
    prompt.ask(function(repo) {
      if (!repo) {
        cb();
        return;
      }

      new Text({
        name: 'dest',
        message: 'Destination directory?',
        default: opts.dest || path.basename(repo)
      })
        .ask(function(dest) {
          clone({repo: repo, dest: dest}, cb);
        });
    });
  });

  return prompt;
};
