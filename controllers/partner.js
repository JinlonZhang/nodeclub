var Partner   = require('../proxy').Partner;

exports.index = function (req, res, next) {
  var ep = new eventproxy();
  ep.fail(next);

  Partner.find(query, '', options, ep.done('partners'));
}
