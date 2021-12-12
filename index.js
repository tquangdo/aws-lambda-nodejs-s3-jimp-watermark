"use strict";

const Jimp = require("jimp");
var AWS = require("aws-sdk");
const s3 = new AWS.S3();
const BUCKET_NAME = process.env["BUCKET_NAME"];
const OUTPUT_FOLDER = "output";

var getDownloadUrl = async function (bucket, key) {
    var params = { Bucket: bucket, Key: key }; // default thì exprire time là 15 phút
    var url = s3.getSignedUrl("getObject", params);
    console.log(url);

    return url;
};
var uploadImageToS3 = function (imageBuffer, bucket, key) {
    var params = {
        Body: imageBuffer,
        Bucket: bucket,
        Key: key
    };

    return s3.putObject(params).promise();
};
var addWatermark = async function (url) {
    // step 1: đọc file input
    const original = await Jimp.read(url);
    // // step 2: đọc file watermark
    const mark = await Jimp.read("./wm.png"); // file watermark sẽ đặt luôn trong source folder
    // // step 3: // set độ mờ của watermark
    mark.opacity(0.5);
    // // step 4: add watermark vào ảnh
    const watermarkedImage = await original.composite(mark, 50, 50);

    return await watermarkedImage.getBufferAsync(Jimp.MIME_PNG);
};

// {
//     "Records": [
//         {
//             "eventVersion": "2.0",
//             "eventSource": "aws:s3",
//             "awsRegion": "us-west-2",
//             "eventTime": "1970-01-01T00:00:00.000Z",
//             "eventName": "ObjectCreated:Put",
//             "userIdentity": {
//                 "principalId": "AIDAJDPLRKLG7UEXAMPLE"
//             },
//             "requestParameters": {
//                 "sourceIPAddress": "127.0.0.1"
//             },
//             "responseElements": {
//                 "x-amz-request-id": "C3D13FE58DE4C810",
//                 "x-amz-id-2": "FMyUVURIY8/IgAtTv8xRjskZQpcIZ9KG4V5Wp6S7S/JRWeUWerMUE5JgHvANOjpD"
//             },
//             "s3": {
//                 "s3SchemaVersion": "1.0",
//                 "configurationId": "testConfigRule",
//                 "bucket": {
//                     "name": "sourcebucket",
//                     "ownerIdentity": {
//                         "principalId": "A3NL1KOZZKExample"
//                     },
//                     "arn": "arn:aws:s3:::sourcebucket"
//                 },
//                 "object": {
//                     "key": "HappyFace.jpg",
//                     "size": 1024,
//                     "eTag": "d41d8cd98f00b204e9800998ecf8427e",
//                     "versionId": "096fKKXTRTtl3on89fVO.nfljtsv6qko"
//                 }
//             }
//         }
//     ]
// }
exports.handler = async function (event, context) {
    // lấy thông tin file đã được upload từ event
    let key = event.Records[0].s3.object.key;
    console.log(key);

    let fileName = key.split("/").pop();
    console.log(fileName);
    console.log(BUCKET_NAME);

    // gắn watermark
    return getDownloadUrl(BUCKET_NAME, key)
        .then(addWatermark) // gọi hàm gắn watermark với input là downloadUrl trả về từ getDownloadUrl
        .then(buffer => {
            let outputKey = `${OUTPUT_FOLDER}/${fileName}`;
            console.log(outputKey);

            return uploadImageToS3(buffer, BUCKET_NAME, outputKey);
        })
        .then(data => {
            console.log(data);

            return data;
        })
        .catch(err => {
            console.log(err);

            return err;
        });
};