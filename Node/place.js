/**
 * Created by Валера on 07.03.2018.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017';
var dbUrl =('KS');
const uuidv1 = require('uuid/v1');

module.exports = {

    createPlace: function (title,latitude,longitude,userId) {
        MongoClient.connect(url,function (err,client) {
            var db = client.db(dbUrl);
            db.collection('place').insertOne({
                "_id": uuidv1(),
                "title": title,
                "latitude": latitude,
                "longitude": longitude,
                "userId": userId
            }, function (err, result) {
                assert.equal(err, null);
                console.log("Saved place");
            });
        })
    },

    getUserPlace: function (userId,callback){
        MongoClient.connect(url,function (err,client) {
            var db = client.db(dbUrl);
            console.log(userId);
            db.collection('place').find({'userId':userId}).toArray(function (err,result) {
                assert.equal(err, null);
                if(result){
                    console.log(result);
                    callback(result);
                }
                else {
                    callback(false);
                }

            })
        })
    },

    deletePlace: function(id,callback){
        MongoClient.connect(url,function (err,client) {
            var db = client.db(dbUrl);
            db.collection('place').deleteOne({'_id':id},function(err,result){
                assert.equal(err, null);
                if(result){
                    callback(result);
                }
                else {
                    callback(false);
                }
            })
        })
    }

};