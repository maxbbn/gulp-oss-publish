# gulp-oss-publish

Publish files with oss

- 1. Can publish files with prefix and shortId
- 2. simple
- 3. usable


When genShortId enabled： oss key will be `${prefix}/${shortId}/${filePath}` 

otherwise oss key should like this  `${prefix}/${filePath}`


## Install

```shell
npm install gulp-oss-publish
```

## Use

```js
import publish from 'gulp-oss-publish';

gulp.task('publish', () => 
  gulp
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
    }))
);
```
