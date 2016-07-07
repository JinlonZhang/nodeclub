(function(global) {
var SUPPORT_LANGUAGES = {
	"en-US": "English",
	"zh-CN": "Chinese",
	"de-DE": "German",
	"ru-RU": "Russian",
	"ja-JP": "Japanese"
};

var DEFAULT_LANGUAGE = "en-US";

function Language(messages) {
	this.messages = global.i18n;
};

Language.prototype.isSupportLanguage = function(lang){
	return (lang in SUPPORT_LANGUAGES);
}

Language.prototype.getLocale = function(){
	var lang = $("#currentLanguage").val();
	if(this.isSupportLanguage(lang)){
		return lang;
	}else{
		return DEFAULT_LANGUAGE;
	}
};

Language.prototype.getMessage = function(key){
	return this.messages[key] && this.messages[key][this.getLocale()];
};

global.Language = Language;

})(this);
