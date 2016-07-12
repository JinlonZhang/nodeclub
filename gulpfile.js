var moment = require('moment');
var gulp = require('gulp');
var qnUpload = require('./qnUpload');
var config = require('./config');
var fs = require('fs');

/**
 * dev
 * npm install
 * make run
 */

var mod = {
  isProd: function(){
    return process.env.NODE_ENV === 'production';
  },
  setConfig : function() {
    var o = {};
    o.timeStamp = moment().format("YYMMDDHHmmss");
    fs.writeFileSync('./' + this.getFile(), JSON.stringify(o));
  },
  getFile: function(){
    return 'config.json';
  },
  setUrl : function() {
    //更新配置内容
    var o = mod.getConfig();
    o.site_static_host = config.site_qn_host +'kb' + o.timeStamp;
    fs.writeFileSync('./' + this.getFile(), JSON.stringify(o));
  },
  getConfig: function(){
    var o = fs.readFileSync('./' + this.getFile());
    return JSON.parse(o.toString());
  }
}

/**
 * production(发布)
 *
 * npm install
 * make pretest
 * make build
 * push source
 * change config
 * build image
 * push image
 */

 gulp.task('config', function(){
   mod.setConfig();
 })
 /**
  * 拷贝静态资源至版本文件夹
  */
 gulp.task('copy', function(){
   mod.setConfig();
   var config = mod.getConfig();
   var arr = [
     './public/**/*'
   ];
   return gulp.src(arr)
     .pipe(gulp.dest('./kb' + config.timeStamp+'/public'));
 });
/**
 * 静态资源上传至七牛云空间。
 */
gulp.task('upload', ['copy'],function(){
  var config = mod.getConfig();
  return gulp.src('./@(kb'+ config.timeStamp +')/public/**/*')
    .pipe( qnUpload() );
});


gulp.task('update', ['upload'], function() {
  mod.setUrl();
});

//构建开发环境
gulp.task('build', function() {
    gulp.run(['config', 'copy', 'upload', 'update']);
});
