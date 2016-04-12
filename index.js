var ALY = require('aliyun-sdk');
var mime = require('mime');
var path = require('path');
var through2 = require('through2');
var shortId = require('shortid');
var urlJoin = require('url-join');
var gutil = require('gulp-util');
module.exports = publish;
/**
 * @params options.prefix root for oss
 * @params {boolean} options.genShortId
 * @params options.oss
 * @params options.oss.accessKeyId
 * @params options.oss.secretAccessKey
 * @params options.oss.endpoint
 * @params options.headers
 */
function publish(options) {
  const oss = options.oss;
  const prefix = options.prefix || '';
  const uid = options.genShortId ? shortId.generate() : '';
  const keyBase = urlJoin(prefix, uid);

  var client = new ALY.OSS({
    accessKeyId: oss.accessKeyId,
    secretAccessKey: oss.secretAccessKey,
    endpoint: oss.endpoint,
    apiVersion: '2013-10-15'
  });

  var distFiles = [];

  return through2.obj(function(file, enc, cb){
    if (!file) return cb();
    if (!file.isBuffer()) return cb();
    this.push(file);
    const key = urlJoin(keyBase, file.relative);

    //console.log(key);

    function onEnd(err) {
      if (!err) {
        distFiles.push(key);
        cb();
      } else {
        cb(err)
      }
    }

    client.putObject(Object.assign({
        ContentType: mime.lookup(file.relative),
        CacheControl: !options.genShortId ? 'no-cache' : 'max-age=7200,s-maxage=3600',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
        ContentEncoding: 'utf-8',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
        ServerSideEncryption: 'AES256'
        // Expires: null                     // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
      }, options.headers || {}, {
        Bucket: oss.bucket,
        Key: urlJoin(prefix, uid, file.relative), // 注意, Key 的值不能以 / 开头, 否则会返回错误.
        Body: file.contents
      }), onEnd);

  }, function(cb){
    gutil.log('OSS publish finished,  %s files published', gutil.colors.cyan.underline(distFiles.length));
    gutil.log('dist bucket: %s', gutil.colors.cyan(oss.bucket));
    gutil.log('dist root: %s', gutil.colors.cyan(keyBase));
    distFiles.forEach(function (key) {
      gutil.log('file: %s', key);
    });
    cb();
  });
}
