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
    var name           = req.body.name;
    var mobile         = req.body.mobile;
    var email          = req.body.email;
    var company        = req.body.company;
    var position       = req.body.position;
    var events_id      = req.body.events_id;

    if(mobile.length < 11){
        res.json({code: -1, msg: '不是手机号'});
        return;
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

        User.getUserById(req.session.user._id, function (err2, user) {
            user.score += 5;
            user.topic_count += 1;
            req.session.user = user;
            user.save(function(err3){
                res.redirect('/events');
            });
        });
    });
};