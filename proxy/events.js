var EventProxy = require('eventproxy');
var models     = require('../models');
//var Topic      = models.Topic;
var Events     = models.Events;
var User       = require('./user');
var Reply      = require('./reply');
var tools      = require('../common/tools');
var at         = require('../common/at');
var _          = require('lodash');
var o = {
    title: 'title',
    start_time: 'start_time',
    end_time: 'end_time',
    province: 'province',
    city: 'city',
    adress: 'adress',
    sponsor: 'sponsor',
    active_detail: 'active_detail',
    people_num: 'people',
    fees: 'fees',
    verify: 'verify',
    cost: 'cost',
    cover_url: 'cover_url',
    language_type: 'language_type',
    events_type: 'events_type'
}
exports.newAndSave = function (o, authorId, callback) {
    var events       = new Events();
    events.title     = o.title;
    events.start_time   = o.start_time;
    events.end_time       = o.end_time;
    events.province = o.province;
    events.city = o.city;
    events.adress = o.adress;
    events.sponsor = o.sponsor;
    events.active_detail = o.active_detail;
    events.people_num = o.people_num;
    events.fees = o.fees;
    events.verify = o.verify;
    events.author_id = authorId;
    events.cost = o.cost;
    events.cover_url = o.cover_url;
    events.language_type = o.language_type;
    events.events_type = o.events_type;

    events.save(callback);
};

/**
 * 根据关键词，获取主题列表
 * Callback:
 * - err, 数据库错误
 * - count, 主题列表
 * @param {String} query 搜索关键词
 * @param {Object} opt 搜索选项
 * @param {Function} callback 回调函数
 */

exports.getActiveByQuery = function (query, opt, callback) {

  query.deleted = false;
  Events.find(query, opt, callback);
};

/**
 * 获取关键词能搜索到的主题数量
 * Callback:
 * - err, 数据库错误
 * - count, 主题数量
 * @param {String} query 搜索关键词
 * @param {Function} callback 回调函数
 */
exports.getCountByQuery = function (query, callback) {
  query.deleted = false;
  Events.count(query, callback);
};

exports.getActiveById = function (id, callback) {
  Events.findById(id, callback);
};
