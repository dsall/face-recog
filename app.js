// Load the AWS SDK for Node.js
const mongoose = require('mongoose');
const Store = require("./addFaceID");
const cors = require('cors');



var AWS = require('aws-sdk');
// Load credentials and set region from JSON file

var bodyParser = require('body-parser');

const fs = require('fs-extra');

AWS.config.loadFromPath('./config.json');

var multer  = require('multer');

var upload = multer({ dest: 'uploads/' });
var express = require('express');
var app = express();
//qkfbZ8DHGPyEH2xD


app.use(express.static('public'));

var rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});
var s3 = new AWS.S3({apiVersion: '2006-03-01'});


var collection = "webvr";
var Bucket = "webvrworkshop";

mongoose.connect(
    "mongodb+srv://dsall:qkfbZ8DHGPyEH2xD@test-rbyf3.mongodb.net/Face-Recog",  { useNewUrlParser: true }
  );


app.post('/upload',  upload.single('image'), (req,res,next) =>{
    var bitmap = fs.readFileSync(req.file.path);
    var name = req.file.originalname;
    var person_name = req.body.name;

    var params2 = {
        CollectionId: collection, 
        DetectionAttributes: [
        ], 
        Image: {
         Bytes: bitmap
        }
       };
        rekognition.indexFaces(params2, function(err, data) {
            if (err) {
                res.send('cant create index');
            }
            else {
                var data = {
                            Confidence: data.FaceRecords[0].Face.Confidence,
                            FaceID: data.FaceRecords[0].Face.FaceId,
                            ImageID: data.FaceRecords[0].Face.ImageId
                            }
                // console.log(data);
                if(data.Confidence > 90){
                     const addeddata = new Store({
                        _id: new mongoose.Types.ObjectId(),
                        name: person_name,
                        face_id: data.FaceID,
                      });
                      addeddata
                        .save()
                        .then(result => {
                          res.status(201).json({
                            message: "data uploaded",
                            FaceData: result,
                          });
                        })
                        .catch(err => {
                          res.status(500).json({  
                            error: err
                          });
                        });
                }           
            }
            });
});

app.post('/rekognize', upload.single("image"), function (req, res, next) {
    var bitmap = fs.readFileSync(req.file.path);
     rekognition.searchFacesByImage({
     "CollectionId": collection,
     "FaceMatchThreshold": 90,
     "Image": { 
         "Bytes": bitmap,
     },
     "MaxFaces": 1
  }, function(err, data) {
     if (err) {
        //  console.log(err);
         res.send(err);
     } else {
         
        if(data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face)
        {
            // console.log(data.FaceMatches[0].Similarity);
            // console.log(data.FaceMatches[0].Face.FaceId);
            Store.find({face_id: data.FaceMatches[0].Face.FaceId})
            .exec()
            .then(doc => {
                res.status(201).json({
                    success: true,
                    message: "Welcome",
                    Name: doc[0].name,
                  });
            })
            .catch(err => {
                console.log(err);
            })
        } else {
            res.status(201).json({
                success: false,
              });
        }
    }
 });
 });
 
// var params = {
//     CollectionId: collection
//    };
//    rekognition.createCollection(params, function(err, data) {
//      if (err) console.log(err, err.stack); // an error occurred
//      else     console.log(data);           // successful response
//      /*
//      data = {
//       CollectionArn: "aws:rekognition:us-west-2:123456789012:collection/myphotos", 
//       StatusCode: 200
//      }
//      */
//    });
// var params = {
//     CollectionId: collection
//    };
//    rekognition.deleteCollection(params, function(err, data) {
//      if (err) console.log(err, err.stack); // an error occurred
//      else     console.log(data);           // successful response
//      /*
//      data = {
//       StatusCode: 200
//      }
//      */
//    });


app.listen(3000, function () {
	console.log('Listening on port 3000');
})

