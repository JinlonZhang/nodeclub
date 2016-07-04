
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
  	"sign_in" : {
			 "en-US": "Sign In",
			 "zh-CN": "登录"
		 },
		 "events" : {
			 "en-US": "Events",
			 "zh-CN": "活动"
		 },
		 "topic" : {
				"en-US": "topic",
				"zh-CN": "话题"
			},
		 "setting" : {
			 "en-US": "setting",
			 "zh-CN": "设置"
		 },
		 "topic" : {
				"en-US": "topic",
				"zh-CN": "话题"
			},
			"log_out" : {
				 "en-US": "log_out",
				 "zh-CN": "退出"
			 },
			 "sign_in" : {
 				 "en-US": "sign_in",
 				 "zh-CN": "登录"
 			 },
			 "sign_up" : {
 				 "en-US": "sign_up",
 				 "zh-CN": "注册"
 			 }
}

var language = new I18n(global_messages);

module.exports = language;
