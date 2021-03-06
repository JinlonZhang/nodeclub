var multiline = require('multiline');
var config       = require('../config');
// static page
// About
exports.about = function (req, res, next) {
  res.render('static/about', {
    pageTitle: '关于我们'
  });
};

// blog
exports.blog = function (req, res, next) {
  res.render('blog/index', {
    pageTitle: 'boke'
  });
};

// FAQ
exports.faq = function (req, res, next) {
  res.render('static/faq');
};

exports.getstart = function (req, res) {
  res.render('static/getstart', {
    pageTitle: 'Node.js 新手入门'
  });
};


exports.robots = function (req, res, next) {
  res.type('text/plain');
  res.send(multiline(function () {;
/*
# See http://www.robotstxt.org/robotstxt.html for documentation on how to use the robots.txt file
#
# To ban all spiders from the entire site uncomment the next two lines:
# User-Agent: *
# Disallow: /
*/
  }));
};

exports.api = function (req, res, next) {
  res.render('static/api');
};


exports.language = function (req, res, next) {
  config.language = req.params.type;
  var langPathname = req.query.ref;
  res.redirect(langPathname);
}
