var EventProxy = require('eventproxy');
var models     = require('../models');
var SignUp     = models.SignUp;
var User       = require('./user');
var Reply      = require('./reply');
var tools      = require('../common/tools');
var at         = require('../common/at');
var _          = require('lodash');

var o = {
    name: 'name',
    mobile: 'mobile',
    email: 'email',
    company: 'company',
    position: 'position',
    events_id: 'events_id'
}

exports.newAndSave = function (o, authorId, callback) {
    console.log('pro-sign=====authorId======' + authorId);
    var sign_up      = new SignUp();
    sign_up.name     = o.name;
    sign_up.mobile   = o.mobile;
    sign_up.email    = o.email;
    sign_up.company  = o.company;
    sign_up.position = o.position;
    sign_up.user_id  = authorId,
    sign_up.events_id= o.events_id

    sign_up.save(callback);
};