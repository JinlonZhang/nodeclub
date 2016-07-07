
var config = require('./config');
var i18n = require('./i18n/language.json');

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
var language = new I18n(i18n);

module.exports = language;
