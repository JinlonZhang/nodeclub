var validator = require('validator');

var at           = require('../common/at');
var User         = require('../proxy').User;
var SignUP       = require('../proxy').SignUp;
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


exports.put = function (req, res, next) {
    var name           = validator.trim(req.body.name);
    var mobile         = validator.trim(req.body.mobile);
    var email          = validator.trim(req.body.email);
    var company        = validator.trim(req.body.company);
    var position       = validator.trim(req.body.position);
    var events_id      = validator.trim(req.body.events_id);

    // 验证
    var editError;
    if (name === '') {
        editError = '姓名不能是空的。';
    } else if (mobile.length == 11 && typeof(mobile) == 'number') {
        editError = '手机号码';
    } else if (email === '') {
        editError = '邮箱必填'
    } else if (company === '') {
        editError = '公司名称必填';
    } else if (position === '') {
        editError = '职位必填';
    }
    // END 验证

    if (editError) {
        res.status(422);
        return res.render('events/sign_up/' + events_id, {
            events: events,
            edit_error: editError,
            name: name,
            mobile: mobile,
            email: email,
            company: company,
            position: position
        });
    }

    var o = {
        name: name,
        mobile: mobile,
        email: email,
        company: company,
        position: position,
        events_id: events_id
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