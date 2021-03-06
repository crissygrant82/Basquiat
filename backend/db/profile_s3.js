var AWS = require('aws-sdk');
var db = require("./index");
const config = require('../../config')

var s3 = new AWS.S3();
var myBucket = config.bucket;
var myKey = config.key;



//const url = s3.getSignedUrl('getObject', { Bucket: 'your bucket name', Key: 'the filename'})


profileUpload = (req, res, next) => {
  console.log(req.files.file);

  console.log(req.body.user_id);
  let user = req.body.username;
  let imageFile = req.files.file;
// /console.log(passport, payload);

s3.createBucket({Bucket: myBucket}, function(err, data) {

if (err) {

   console.log("Err",err);
   res.status(status).send(message)

   } else {

     params = {
       Bucket: myBucket,
       Key: myKey + user ,
       Body: imageFile.data,
       ContentType: imageFile.mimetype,
       ACL: 'public-read'
     };

      var upload = new AWS.S3.ManagedUpload({params: params});
      upload.send(function(err, data) {
      const profileURL = data.Location.toString();
      const user_id = req.body.user_id
      console.log("profileURL ",profileURL);

      db.oneOrNone('UPDATE users SET profile_pic_url=($1) WHERE id=($2) RETURNING *', [profileURL, user_id])
        .then(()=> {
          console.log(`inserted in pic:`, data);
          res.status(200).json({
            data
          })
        })
        .catch(err => {
          console.log('Create User Error: ',err, err.toString());
          res.status(500).send(err.message)
        })

      });
    }

  })

}

module.exports = {
  profileUpload,
}
