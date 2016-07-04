var EventProxy = require('eventproxy');
var models     = require('../models');
var Partner    = models.Partner;
var _          = require('lodash');

/**
 * [getFullPartner 获取全部的合作伙伴]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.getFullPartner = function (query, opt, callback) {
  Partner.find(query, callback);
}


exports.newAndSave = function (name, url, img_url, callback) {
  var partner       = new Partner();
  partner.name      = name;
  partner.url       = url;
  partner.img_url   = img_url;

  partner.save(callback);
};
