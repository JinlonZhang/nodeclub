
var config = require('./config');

var SUPPORT_LANGUAGES = {
	"en-US": "English",
	"zh-CN": "Chinese",
	"de-DE": "German",
	"ru-RU": "Russian",
	"ja-JP": "Japanese"
};

var DEFAULT_LANGUAGE = "en-US";

var I18n = function(messages) {
	this.messages = messages;
};

I18n.prototype.isSupportLanguage = function(lang){
	return (lang in SUPPORT_LANGUAGES);
}

I18n.prototype.getLocale = function(){
//	var lang = $("#currentLanguage").val();
	var lang = config.language;
	if(this.isSupportLanguage(lang)){
		return lang;
	}else{
		return DEFAULT_LANGUAGE;
	}
};

I18n.prototype.getMessage = function(key){
	return this.messages[key][this.getLocale()];
};

var global_messages = {
  	"index" : {
			 "en-US": "Index",
			 "zh-CN": "首页"
		 },
		 "events" : {
			 "en-US": "Events",
			 "zh-CN": "活动"
		 },
		 "topic" : {
				"en-US": "Topic",
				"zh-CN": "话题"
			},
			"about" : {
 				"en-US": "About",
 				"zh-CN": "关于"
 			},
		 "setting" : {
			 "en-US": "Setting",
			 "zh-CN": "设置"
		 },
		 "topic" : {
				"en-US": "Topic",
				"zh-CN": "话题"
			},
			"log_out" : {
				 "en-US": "Log Out",
				 "zh-CN": "退出"
			 },
			 "sign_in" : {
 				 "en-US": "Sign In",
 				 "zh-CN": "登录"
 			 },
			 "sign_up" : {
 				 "en-US": "Sign Up",
 				 "zh-CN": "注册"
 			 },
			 backtotop : {
				 "en-US": "Top",
 				 "zh-CN": "回到顶部"
			 },
			 profile : {
				 "en-US": "Profile",
 				 "zh-CN": "个人信息"
			 },
			 hot_topic: {
				 "en-US": "Hot Topic",
 				 "zh-CN": "热门话题"
			 },
			 contact_us : {
				 "en-US": "Contact Us",
 				 "zh-CN": "联系我们"
			 },
			 rank : {
				 "en-US": "Rank",
 				 "zh-CN": "积分榜"
			 },
			 score : {
				 "en-US": "Score",
 				 "zh-CN": "积分"
			 },
			 publish : {
				 "en-US": "Publish",
 				 "zh-CN": "发布话题"
			 },
			 submit : {
				 "en-US": "Submit",
 				 "zh-CN": "提交"
			 },
			 submiting : {
				"en-US": "Submiting",
					"zh-CN": "提交中"
			}
}

var language = new I18n(global_messages);

module.exports = language;
