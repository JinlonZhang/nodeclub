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
  getFile: function(){
    return 'config.json';
  },
  setUrl : function() {
    //更新配置内容
    var o = {};
    o.site_static_host = config.site_qn_host;
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

/**
 * 静态资源上传至七牛云空间。
 */
gulp.task('upload', function(){
  return gulp.src('./public/**/*')
    .pipe( qnUpload() );
});


gulp.task('update', ['upload'], function() {
  mod.setUrl();
});

//构建开发环境
gulp.task('build', function() {
    gulp.run(['upload', 'update']);
});
