var EventProxy = require('eventproxy');
var models     = require('../models');
var Partner    = models.Partner;
var _          = require('lodash');

exports.getFullPartner = function (callback) {
  Partner.find('', callback);
}
