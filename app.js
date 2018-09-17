// Load the AWS SDK for Node.js
const mongoose = require('mongoose');
const Store = require("./addFaceID");
const cors = require('cors');



var AWS = require('aws-sdk');
// Load credentials and set region from JSON file

var bodyParser = require('body-parser');

const fs = require('fs-extra');

AWS.config.loadFromPath('./config.json');
const fileName = 'dsall1.jpg';

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });
var express = require('express');
var app = express();


// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );
//     if (req.method === "OPTIONS") {
//       res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET, OPTIONS");
//       return res.status(200).json({});
//     }
//     next();
//   });


app.use(express.static('public'));
app.use(bodyParser.json({limit: '100mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Vary", 'Origin');
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET, OPTION");
      return res.status(200).json({});
    }
    next();
  });


var uuid = require('node-uuid');
var path = require('path');

//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html

var rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

var collection = "webvr";
var Bucket = "webvrworkshop";

const uploadFile = (data) => {
       const params = {
           Bucket: Bucket, // pass your bucket name
           Key: 'matt.jpeg', // file will be saved as testBucket/contacts.csv
           Body: data
       };
       s3.upload(params, function(s3Err, data) {
           if (s3Err) throw s3Err
           console.log(data);
           CreateIndex(data);
       });
};
  
CreateIndex = (name) =>{
    var params = {
    CollectionId: collection, 
    DetectionAttributes: [
    ], 
    Image: {
     S3Object: {
      Bucket: Bucket, 
      Name: name.key
     }
    }
   };
   rekognition.indexFaces(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     {
        
        var resp = {
            FaceId: name.Location,

        }
         console.log(data.FaceRecords[0].Face.Confidence);
         console.log(data.FaceRecords[0].Face.FaceId);
         console.log(data.FaceRecords[0].Face.ImageId);
         
     }// successful response


   });

}





app.post('/api/upload', upload.single("image"), function (req, res, next) {
     var bitmap = fs.readFileSync(req.file.path);
    console.log(req.body);
    uploadFile(bitmap);
    res.send("uploaded");
});


app.post('/api/recognize', upload.single("image"), function (req, res, next) {
console.log(req.file);
   var bitmap = fs.readFileSync(req.file.path);
   console.log(bitmap);
    rekognition.searchFacesByImage({
    "CollectionId": collection,
    "FaceMatchThreshold": 90,
    "Image": { 
        "Bytes": bitmap,
    },
    "MaxFaces": 1
}, function(err, data) {
    if (err) {
        console.log(err);
        res.send(err);
    } else {
        
       if(data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face)
       {
           console.log(data);
           res.send(data);	
       } else {
           console.log(err);
           res.send("Not recognized");
           console.log('not recognized');
       }
   }
});
});




app.listen(3000, function () {
	console.log('Listening on port 3000');
})

