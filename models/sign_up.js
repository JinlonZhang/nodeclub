//var mongoose  = require('mongoose');
//var BaseModel = require("./base_model");
//var Schema    = mongoose.Schema;
//var ObjectId  = Schema.ObjectId;
//var config    = require('../config');
//var _         = require('lodash');

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config   = require('../config');
var _        = require('lodash');

var SignUpSchema = new Schema({
    events_id: { type: ObjectId },
    name: { type: String },   //姓名
    mobile: { type: Number },  //手机号码
    email: { type: String },   //邮箱
    company: { type: String },  //公司
    position: { type: String }   //职位
});

mongoose.model('SignUp', SignUpSchema);
