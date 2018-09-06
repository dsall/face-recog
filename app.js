// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Load credentials and set region from JSON file

const fs = require('fs');

AWS.config.loadFromPath('./config.json');

const fileName = 'mark3.jpg';
//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html

var rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

const uploadFile = () => {
    fs.readFile(fileName, (err, data) => {
       if (err) throw err;
       const params = {
           Bucket: 'sallface', // pass your bucket name
           Key: fileName, // file will be saved as testBucket/contacts.csv
           Body: data
       };
       s3.upload(params, function(s3Err, data) {
           if (s3Err) throw s3Err
           console.log(`File uploaded successfully at ${data.Location}`)
       });
    });
  };
  

  var params = {
    SimilarityThreshold: 90, 
    SourceImage: {
     S3Object: {
      Bucket: "sallface", 
      Name: "mark.jpg"
     }
    }, 
    TargetImage: {
     S3Object: {
      Bucket: "sallface", 
      Name: "mark2.jpg"
     }
    }
   };

   const Compare = () => {
   rekognition.compareFaces(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
   });

//    { SourceImageFace:
//     { BoundingBox:
//        { Width: 0.4955621361732483,
//          Height: 0.4955621361732483,
//          Left: 0.2625739574432373,
//          Top: 0.08875739574432373 },
//       Confidence: 99.95243835449219 },
//    FaceMatches: [ { Similarity: 98, Face: [Object] } ],
//    UnmatchedFaces: [],
//    SourceImageOrientationCorrection: 'ROTATE_0',
//    TargetImageOrientationCorrection: 'ROTATE_0' }
}


// var params = {
//     CollectionId: "myphotos", 
//     FaceId: "70008e50-75e4-55d0-8e80-363fb73b3a14", 
//     FaceMatchThreshold: 90, 
//     MaxFaces: 10
//    };
//    rekognition.searchFaces(params, function(err, data) {
//      if (err) console.log(err, err.stack); // an error occurred
//      else     console.log(data);           // successful response

//    });


// var params = {
//     CollectionId: "myphotos", 
//     FaceMatchThreshold: 90, 
//     Image: {
//      S3Object: {
//       Bucket: "sallface", 
//       Name: "mark2.jpg"
//      }
//     }, 
//     MaxFaces: 5
//    };
//    rekognition.searchFacesByImage(params, function(err, data) {
//      if (err) console.log(err, err.stack); // an error occurred
//      else     console.log(data);           // successful response

//    });


   const CheckImage = () => {
    fs.readFile(fileName, (err, data) => {
       if (err) throw err;
       const params = {
           Bucket: 'sallface', // pass your bucket name
           Body: data
       };
        rekognition.searchFacesByImage(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
       });
    });
  };

  CheckImage();