# gulp-oss-publish

Publish files with oss


## Install

```shell
npm install gulp-oss-publish
```

## Use

```js
import publish from 'gulp-oss-publish';

gulp.task('publish', ['build'], () => {
  return gulp
    .src('dist/**/*', {
      base: 'dist',
      buffer: true
    })
    .pipe(publish({
      prefix: 'a/puca-web',
      genShortId: true,
      oss: {
        accessKeyId: 'xxx',
        secretAccessKey: 'yyy',
        endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
        bucket: 'your-bucket-name'
      },
      headers: {
        CacheControl: 'no-cache',
        ServerSideEncryption: 'AES256'
      }
    }));
});
```
