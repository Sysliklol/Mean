/**
 * Created by Валера on 05.03.2018.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017';
const bCrypt = require('bcrypt');
var dbUrl =('KS');
const uuidv1 = require('uuid/v1');





module.exports = {
    validateSignIn: function(username, password,callback){
        MongoClient.connect(url, function(err, client){
            var db = client.db(dbUrl);

            db.collection('user').findOne( { email : username
            },function(err, result){

                if(result==null){
                    callback(false);
                }
                else{
                    if(isValidPassword(result,password)){
                        console.log(result);
                        callback(result._id);
                    }
                }
            });
        });
    },

    signup: function(name,email,password,callback){
        MongoClient.connect(url, function(err, client) {
            var db = client.db(dbUrl);

            db.collection('user').findOne( { email : email
            },function(err, result){

                if(result==null){
                   createUser(db,name,email,password);
                }
                else{
                    callback(false);
                }
            });

        });
    },

    getUser: function(userId,callback){
        MongoClient.connect(url,function (err,client) {
            var db=client.db(dbUrl);
            db.collection('user').findOne({_id:userId},

                function(err, result){

                    if(err){}

                    if(result){
                        callback(result);
                    }

                    else{
                        callback(false);
                    }
                }
            )
        })
    },

    getAllUsers: function(callback){
        MongoClient.connect(url,function (err,client) {
            var db = client.db(dbUrl);

            db.collection('user').find({}).toArray(function(err, result) {
                if (result) {
                    console.log(result);
                    callback(result);
                }

                else {
                    callback(false);
                }
            })


        })
    }


};

 function createUser(db,name,email,password){
     password = createHash(password);
     db.collection('user').insertOne( {
         "_id" : uuidv1(),
         "name": name,
         "email": email,
         "password": password,
         "role": "user"
     },function(err, result){
         assert.equal(err, null);
         console.log("Saved the user sign up details.");
     });
  }

 var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
 };

 var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
 };