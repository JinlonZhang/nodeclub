var EventProxy = require('eventproxy');
var models     = require('../models');
//var Topic      = models.Topic;
var Active     = models.Active;
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
    cover_url: 'cover_url'
}
exports.newAndSave = function (o, authorId, callback) {
    var active       = new Active();
    active.title     = o.title;
    active.start_time   = o.start_time;
    active.end_time       = o.end_time;
    active.province = o.province;
    active.city = o.city;
    active.adress = o.address;
    active.sponsor = o.sponsor;
    active.active_detail = o.active_detail;
    active.people_num = o.people_num;
    active.fees = o.fees;
    active.verify = o.verify;
    active.author_id = authorId;
    active.cost = o.cost;
    active.cover_url = o.cover_url;

    active.save(callback);
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
  Active.find(query, opt, callback);
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
  Active.count(query, callback);
};

exports.getActiveById = function (id, callback) {
  console.log('proxy=====id====' + id)
  Active.find(id, callback);
};
