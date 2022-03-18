# aws-lambda-nodejs-s3-jimp-watermark 🐳

![Stars](https://img.shields.io/github/stars/tquangdo/aws-lambda-nodejs-s3-jimp-watermark?color=f05340)
![Issues](https://img.shields.io/github/issues/tquangdo/aws-lambda-nodejs-s3-jimp-watermark?color=f05340)
![Forks](https://img.shields.io/github/forks/tquangdo/aws-lambda-nodejs-s3-jimp-watermark?color=f05340)
[![Report an issue](https://img.shields.io/badge/Support-Issues-green)](https://github.com/tquangdo/aws-lambda-nodejs-s3-jimp-watermark/issues/new)

![overview_](screenshots/overview_.png)

## reference
[vtiblog](https://vtitech.vn/serverless-don-gian-gan-watermark-tu-dong-voi-lambda-s3-va-jimp-plugin/)

## screenshots
+ upload file in "input" folder on S3
---
![in](screenshots/in.jpeg)
+ output file in "ouput" folder on S3
---
![out](screenshots/out.jpeg)
+ log in CloudWatch
![log](screenshots/log.png)
+ connect S3 & Lambda
![s3&lambda](screenshots/s3&lambda.png)
+ Quay trở lại AWS, mở Lambda function và add giá trị cho biến BUCKET_NAME vào enviroment variables: key=`BUCKET_NAME` & value=`dtq-jimp`
