var Partner   = require('../proxy').Partner;
var EventProxy = require('eventproxy');
var config       = require('../config');

exports.index = function (req, res, next) {
  var ep = new EventProxy();
      ep.fail(next);

  ep.all('partners', function(partners) {
    //获取以后渲染合作伙伴的页面
    res.render('partner', {
      partners: partners
    });
  })

  var page = parseInt(req.query.page, 10) || 1;
  var limit = config.list_topic_count;
  var options = {};

  Partner.getFullPartner({}, options, ep.done('partners'));
}

exports.put = function (req, res, next) {
  Partner.newAndSave(name, url, img_url, function (err, partner) {
    if (err) {
      return next(err);
    }
    res.redirect('/partner');
  });
}
