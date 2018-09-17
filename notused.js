//   app.post('/api/recognize', upload.single("image"), function (req, res, next) {
// 	var bitmap = fs.readFileSync(req.file.path);

// 	rekognition.searchFacesByImage({
// 	 	"CollectionId": config.collectionName,
// 	 	"FaceMatchThreshold": 70,
// 	 	"Image": { 
// 	 		"Bytes": bitmap,
// 	 	},
// 	 	"MaxFaces": 1
// 	}, function(err, data) {
// 	 	if (err) {
// 	 		res.send(err);
// 	 	} else {
// 			if(data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face)
// 			{
// 				res.send(data.FaceMatches[0].Face);	
// 			} else {
// 				res.send("Not recognized");
// 			}
// 		}
// 	});
// });


// const CheckImage = (fileName) => {
//     fs.readFile(fileName, (err, data) => {
//        if (err) throw err;
//        const params = {
//            Bucket: 'sallface', // pass your bucket name
//            key: 'Image',
//            Body: data
//        };
//         rekognition.searchFacesByImage(params, function(err, data) {
//         if (err) console.log(err, err.stack); // an error occurred
//         else     console.log(data);           // successful response
//        });
//     });
//   };

// app.listen(3000, function () {
// 	console.log('Listening on port 5555!');
// })


// rekognition.searchFacesByImage({
//     "CollectionId": collection,
//     "FaceMatchThreshold": 90,
//     "Image": { 
//         "Bytes": bitmap,
//     },
//     "MaxFaces": 1
// }, function(err, data) {
//     if (err) {
//         res.send(err);
//     } else {
//        if(data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face)
//        {
//            console.log(data.FaceMatches[0].Face);
//            res.send(data.FaceMatches[0].Face);	
//        } else {
//            res.send("Not recognized");
//            console.log('not recognized');
//        }
//    }
// });


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
    