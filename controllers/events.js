/*!
 * nodeclub - site index controller.
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * Copyright(c) 2012 muyuan
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var validator = require('validator');

var at           = require('../common/at');
var User         = require('../proxy').User;
var Topic        = require('../proxy').Topic;
var Events       = require('../proxy').Events;
var TopicCollect = require('../proxy').TopicCollect;
var EventProxy   = require('eventproxy');
var tools        = require('../common/tools');
var store        = require('../common/store');
var config       = require('../config');
var _            = require('lodash');
var cache        = require('../common/cache');
var logger       = require('../common/logger')
var renderHelper = require('../common/render_helper');
var moment       = require('moment');
var config       = require('../config');


exports.index = function(req, res, next) {

    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;

    var proxy = new EventProxy();
    proxy.fail(next);


    var limit = config.list_active_count;
    var options = { skip: (page - 1) * limit, limit: limit, sort: '-top -last_reply_at'};

    var query = {};
    // 取分页数据
    var pagesCacheKey = JSON.stringify(query) + 'pages';
    cache.get(pagesCacheKey, proxy.done(function (pages) {
        if (pages) {
            proxy.emit('pages', pages);
        } else {
            Events.getCountByQuery(query, proxy.done(function (all_actives_count) {
                var pages = Math.ceil(all_actives_count / limit);
                cache.set(pagesCacheKey, pages, 60 * 1);
                proxy.emit('pages', pages);
            }));
        }
    }));
    // END 取分页数据

    Events.getActiveByQuery({language_type: config.language}, {}, proxy.done('active', function (active) {

        console.log('active =======' + active);
        return active;
    }));

    proxy.all('pages','active',
        function (pages, active) {
            res.render('events/index', {
                active: active,
                pages: pages,
                current_page : page,
                base : '/events'
            });
        });

};

exports.create = function (req, res, next) {

    res.render('events/edit', {
        tabs: config.tabs
    });
};


exports.put = function (req, res, next) {
    var title          = validator.trim(req.body.title);
    var start_time     = validator.trim(req.body.start_time);
    var end_time       = validator.trim(req.body.end_time);
    var province       = validator.trim(req.body.province);
    var city           = validator.trim(req.body.city);
    var adress         = validator.trim(req.body.adress);
    var sponsor        = validator.trim(req.body.sponsor);
    var active_detail  = validator.trim(req.body.active_detail);
    var people_num     = validator.trim(req.body.people_num);
    var fees           = validator.trim(req.body.fees);
    var verify         = validator.trim(req.body.verify);
    var cost           = validator.trim(req.body.cost);
    var cover_url      = validator.trim(req.body.cover_url);
    var language_type  = validator.trim(req.body.language_type);

    // 验证
    var editError;
    if (title === '') {
       editError = '标题不能是空的。';
    } else if (title.length < 5 || title.length > 100) {
       editError = '标题字数在5~100';
    } else if (start_time === '') {
      editError = '时间必填'
    } else if (end_time === '') {
       editError = '结束时间必填';
    } else if (adress === '') {
      editError = '详细地址必填';
    } else if (sponsor === '') {
      editError = '主办方必填';
    } else if (active_detail === '') {
      editError = '活动详情必填';
    } else if (people_num === '') {
      editError = '活动人数必填';
    } else if (fees === 'true') {
      if (cost === '') {
        editError = '费用必填';
      }
    }
    //// END 验证
    //
    if (editError) {
       res.status(422);
       return res.render('events/edit', {
           edit_error: editError,
           title: title,
           start_time: start_time,
           end_time: end_time,
           province: province,
           city: city,
           adress: adress,
           sponsor: sponsor,
           active_detail: active_detail,
           people_num: people_num,
           fees: fees,
           cost: cost,
           cover_url: cover_url
       });
    }
    var o = {
        title: title,
        start_time: start_time,
        end_time: end_time,
        province: province,
        city: city,
        adress: adress,
        sponsor: sponsor,
        active_detail: active_detail,
        people_num: people_num,
        fees: fees,
        verify: verify,
        cost: cost,
        cover_url: cover_url,
        language_type: language_type
    }

    Events.newAndSave(o, req.session.user._id, function (err, topic) {
        if (err) {
            return next(err);
        }

        var proxy = new EventProxy();

        proxy.all('score_saved', function () {
            res.redirect('/events');
        });
        proxy.fail(next);
        User.getUserById(req.session.user._id, proxy.done(function (user) {
            user.score += 5;
            user.topic_count += 1;
            user.save();
            req.session.user = user;
            proxy.emit('score_saved');
        }));

    });
};

/*
*活动详情页
*
*/
exports.detail = function (req, res, next) {
  var proxy = new EventProxy();
  var id = {_id: req.params.aid}
  Events.getActiveById(id, proxy.done('detail', function (detail) {
      detail.visit_count += 1;
      detail.save();
      return detail;
  }));


  proxy.all('detail', function (detail) {
      res.render('events/detail', {
        detail: detail
      });
  });

};

/*
编辑活动
*/
exports.showEdit = function (req, res, next) {
  var proxy = new EventProxy();
  var active_id = req.params.aid;

  Events.getActiveById(active_id, proxy.done('active', function (active) {
      return active;
  }));

  proxy.all('active', function (active) {
      res.render('events/edit', {
        action: 'edit',
        active: active,
        title: active.title,
        start_time: active.start_time,
        end_time: active.end_time,
        province: active.province,
        city: active.city,
        adress: active.adress,
        sponsor: active.sponsor,
        active_detail: active.active_detail,
        people_num: active.people_num,
        fees: active.fees,
        verify: active.verify,
        cost: active.cost,
        cover_url: active.cover_url,
        language_type: active.language_type
      });
  });

};

exports.update = function (req, res, next) {

  var active_id = req.params.aid;
  var title = req.body.title;
  var start_time = req.body.start_time;
  var end_time = req.body.end_time;
  var province = req.body.province;
  var city = req.body.city;
  var adress = req.body.adress;
  var sponsor = req.body.sponsor;
  var active_detail = req.body.active_detail;
  var people_num = req.body.people_num;
  var fees = req.body.fees;
  var verify = req.body.verify;
  var cost = req.body.cost;
  var cover_url = req.body.cover_url;
  var language_type = req.body.language_type;
  var update_at = Date();

  // 验证
  var editError;
  if (title === '') {
     editError = '标题不能是空的。';
  } else if (title.length < 5 || title.length > 100) {
     editError = '标题字数在5~100';
  } else if (start_time === '') {
    editError = '时间必填'
  } else if (end_time === '') {
     editError = '结束时间必填';
  } else if (adress === '') {
    editError = '详细地址必填';
  } else if (sponsor === '') {
    editError = '主办方必填';
  } else if (active_detail === '') {
    editError = '活动详情必填';
  } else if (people_num === '') {
    editError = '活动人数必填';
  } else if (fees === 'true') {
    if (cost === '') {
      editError = '费用必填';
    }
  }
  //// END 验证
  //
  if (editError) {
     res.status(422);
     return res.render('events/edit', {
         edit_error: editError,
         title: title,
         start_time: start_time,
         end_time: end_time,
         province:province,
         active: city,
         adress: adress,
         sponsor: sponsor,
         active_detail: active_detail,
         people_num: people_num,
         fees: fees,
         cost: cost,
         cover_url : cover_url
     });
  }

  Events.getActiveById(active_id, function (err, events) {
      events.title = title;
      events.start_time = start_time;
      events.end_time = end_time;
      events.province = province;
      events.city = city;
      events.adress = adress;
      events.sponsor = sponsor;
      events.active_detail = active_detail;
      events.people_num = people_num;
      events.fees = fees;
      events.verify = verify;
      events.cost = cost;
      events.cover_url = cover_url;
      events.language_type = language_type;
      events.updata_at = update_at;
      events.save(function (err2, d) {
        res.redirect('/events/' + events._id);
      });

  });
};

exports.delete = function (req, res, next) {

  var active_id = req.params.aid;

  Events.getActiveById(active_id, function (err, events) {
    if (err) {
      return res.send({ success: false, message: err.message });
    }
    if (!req.session.user.is_admin && !(events.author_id.equals(req.session.user._id))) {
      res.status(403);
      return res.send({success: false, message: '无权限'});
    }
    if (!events) {
      res.status(422);
      return res.send({ success: false, message: '此活动不存在或已被删除。' });
    }

    events.deleted = true;
    events.save(function (err) {
      if (err) {
        return res.send({ success: false, message: err.message });
      }
      res.send({ success: true, message: '活动已被删除。' });
    });
  });
};
