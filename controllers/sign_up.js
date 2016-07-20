var validator = require('validator');

var at           = require('../common/at');
var User         = require('../proxy').User;
var SignUP       = require('../proxy').SignUp;
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


exports.put = function (req, res, next) {
    var name           = validator.trim(req.body.name);
    var mobile         = validator.trim(req.body.mobile);
    var email          = validator.trim(req.body.email);
    var company        = validator.trim(req.body.company);
    var position       = validator.trim(req.body.position);

    // 验证
    //var editError;
    //if (title === '') {
    //    editError = '标题不能是空的。';
    //} else if (title.length < 5 || title.length > 100) {
    //    editError = '标题字数在5~100';
    //} else if (start_time === '') {
    //    editError = '时间必填'
    //} else if (end_time === '') {
    //    editError = '结束时间必填';
    //} else if (adress === '') {
    //    editError = '详细地址必填';
    //} else if (sponsor === '') {
    //    editError = '主办方必填';
    //} else if (active_detail === '') {
    //    editError = '活动详情必填';
    //} else if (people_num === '') {
    //    editError = '活动人数必填';
    //} else if (fees === 'true') {
    //    if (cost === '') {
    //        editError = '费用必填';
    //    }
    //}
    //// END 验证
    //
    //if (editError) {
    //    res.status(422);
    //    return res.render('events/edit', {
    //        edit_error: editError,
    //        title: title,
    //        start_time: start_time,
    //        end_time: end_time,
    //        province: province,
    //        city: city,
    //        adress: adress,
    //        sponsor: sponsor,
    //        active_detail: active_detail,
    //        people_num: people_num,
    //        fees: fees,
    //        cost: cost,
    //        cover_url: cover_url
    //    });
    //}
    var o = {
        name: name,
        mobile: mobile,
        email: email,
        company: company,
        position: position
    }

    SignUP.newAndSave(o, req.session.user._id, function (err, SignUp) {
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