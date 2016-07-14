var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;
var config    = require('../config');
var _         = require('lodash');

var ActiveSchema = new Schema({
    author_id: { type: ObjectId },  //用户id
    title: { type: String },  //活动标题
    start_time:{type: Date},  //活动开始时间
    end_time:{type: Date},    //活动结束时间
    province: {type: String},  //活动省份
    city: {type: String},         //活动城市
    adress: {type: String},       //活动具体地址
    sponsor: {type: String},     //主办方
    active_detail: {type: String},   //活动详情
    people_num: {type: Number, default: 0 },   //活动人数
    fees: {type: Boolean, default: false},  //是否收费
    verify: {type: Boolean, default: false},  //是否审核
    cost: {type: Number, default: 0 },   //费用
    cover_url: {type: String}, //封面图片
    language_type: {type: String}, //活动语言选择
    Recommend: {type: Boolean, default: false}, //推荐活动
    create_at: { type: Date, default: Date.now },  //
    update_at: { type: Date, default: Date.now },
    deleted: {type: Boolean, default: false},
    visit_count: { type: Number, default: 0 }, //访问次数
    sign_up_count: {type: Number, default: 0 },
    events_type: { type: String}
});

mongoose.model('Active', ActiveSchema);
