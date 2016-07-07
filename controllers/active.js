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
var Active       = require('../proxy').Active;
var TopicCollect = require('../proxy').TopicCollect;
var EventProxy   = require('eventproxy');
var tools        = require('../common/tools');
var store        = require('../common/store');
var config       = require('../config');
var _            = require('lodash');
var cache        = require('../common/cache');
var logger = require('../common/logger')
var renderHelper = require('../common/render_helper');

exports.index = function(req, res, next) {
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var tab = req.query.tab || 'all';

    var proxy = new EventProxy();
    proxy.fail(next);

    // 取主题
    var query = {};
    if (tab && tab !== 'all') {
        if (tab === 'good') {
            query.good = true;
        } else {
            query.tab = tab;
        }
    }

    var limit = config.list_topic_count;
    var options = { skip: (page - 1) * limit, limit: limit, sort: '-top -last_reply_at'};

    Topic.getTopicsByQuery(query, options, proxy.done('topics', function (topics) {
        return topics;
    }));

    // 取排行榜上的用户
    cache.get('tops', proxy.done(function (tops) {
        if (tops) {
            proxy.emit('tops', tops);
        } else {
            User.getUsersByQuery(
                {is_block: false},
                { limit: 10, sort: '-score'},
                proxy.done('tops', function (tops) {
                    cache.set('tops', tops, 60 * 1);
                    return tops;
                })
            );
        }
    }));
    // END 取排行榜上的用户

    // 取0回复的主题
    cache.get('no_reply_topics', proxy.done(function (no_reply_topics) {
        if (no_reply_topics) {
            proxy.emit('no_reply_topics', no_reply_topics);
        } else {
            Topic.getTopicsByQuery(
                { reply_count: 0, tab: {$ne: 'job'}},
                { limit: 5, sort: '-create_at'},
                proxy.done('no_reply_topics', function (no_reply_topics) {
                    cache.set('no_reply_topics', no_reply_topics, 60 * 1);
                    return no_reply_topics;
                }));
        }
    }));
    // END 取0回复的主题

    // 取分页数据
    var pagesCacheKey = JSON.stringify(query) + 'pages';
    cache.get(pagesCacheKey, proxy.done(function (pages) {
        if (pages) {
            proxy.emit('pages', pages);
        } else {
            Topic.getCountByQuery(query, proxy.done(function (all_topics_count) {
                var pages = Math.ceil(all_topics_count / limit);
                cache.set(pagesCacheKey, pages, 60 * 1);
                proxy.emit('pages', pages);
            }));
        }
    }));
    // END 取分页数据

    Active.getActiveByQuery({}, {}, proxy.done('active', function (active) {
        return active;
    }));

    var tabName = renderHelper.tabName(tab);
    proxy.all('topics', 'tops', 'no_reply_topics', 'pages','active',
        function (topics, tops, no_reply_topics, pages, active) {
            res.render('active/index', {
                topics: topics,
                current_page: page,
                list_topic_count: limit,
                tops: tops,
                no_reply_topics: no_reply_topics,
                pages: pages,
                tabs: config.tabs,
                tab: tab,
                pageTitle: tabName && (tabName + '版块'),
                active: active,
            });
        });

};

exports.create = function (req, res, next) {

    res.render('active/edit', {
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

    //// 得到所有的 tab, e.g. ['ask', 'share', ..]
    //var allTabs = config.tabs.map(function (tPair) {
    //    return tPair[0];
    //});
    //
    // 验证
    var editError;
    if (title === '') {
       editError = '标题不能是空的。';
    }
    console.log('editError', editError);
    // } else if (title.length < 5 || title.length > 100) {
    //    editError = '标题字数太多或太少。';
    // } else if (!tab || allTabs.indexOf(tab) === -1) {
    //    editError = '必须选择一个版块。';
    // } else if (content === '') {
    //    editError = '内容不可为空';
    // }
    //// END 验证
    //
    if (editError) {
       res.status(422);
       return res.render('active/edit', {
           edit_error: editError,
           title: title
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
        cost: cost
    }

    Active.newAndSave(o, req.session.user._id, function (err, topic) {
        if (err) {
            return next(err);
        }

        var proxy = new EventProxy();

        proxy.all('score_saved', function () {
            res.redirect('/active');
        });
        proxy.fail(next);
        User.getUserById(req.session.user._id, proxy.done(function (user) {
            user.score += 5;
            user.topic_count += 1;
            user.save();
            req.session.user = user;
            proxy.emit('score_saved');
        }));

        //发送at消息
        //at.sendMessageToMentionUsers(content, topic._id, req.session.user._id);
    });
};
