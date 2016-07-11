var store  = require('./common/store');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var fs = require('fs');
var PluginError = gutil.PluginError;

// 常量
const PLUGIN_NAME = 'gulp-upload';


// 插件级别函数 (处理文件)
function qnUpload(callback) {


  // 创建一个让每个文件通过的 stream 通道
  var stream = through.obj(function(file, enc, cb) {
    var w = this;
    var w = this;
    if (file.isNull()) {
        w.push(file);
        return cb();
    }

    if (file.isBuffer()) {
        var pathname = file.relative.replace(/\\/g, '/');
        pathname = 'public/' + pathname;

        store.upload(fs.createReadStream(pathname), {key: pathname},  function(err, result){
            if(err){
                console.log('************ upload err ***********' + pathname, err);
                w.push(file);
                cb();
                return
            }

            console.log('qiniu upload success ', result.url);
            w.push(file);
            cb();
        });
    }

  });

   // 返回文件 stream
   return stream;
}

// 暴露（export）插件的主函数
module.exports = qnUpload;
