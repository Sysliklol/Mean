/**
 * Created by Валера on 07.03.2018.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017';
var dbUrl =('KS');
const uuidv1 = require('uuid/v1');

module.exports = {

    createPurchase: function (title,description,type,ammount,userId,placeId,callback) {
        MongoClient.connect(url,function (err,client) {
            var db = client.db(dbUrl);


        db.collection('purchase').insertOne( {
            "_id" : uuidv1(),
            "title": title,
            "description": description,
            "type": type,
            "ammount":ammount,
            "place":placeId,
            "userId": userId,
            "date":new Date()
        },function(err, result){
            assert.equal(err, null);
            if(result) {
                callback(true);
            }
            else {
                callback(false);
            }
        });
    })},

    getUserPurchase: function (userId,callback){
        MongoClient.connect(url,function (err,client) {
            var db = client.db(dbUrl);
            console.log(userId);
            db.collection('purchase').find({'userId':userId}).toArray(function (err,result) {
                assert.equal(err, null);
                if(result){
                    callback(result);
                }
                else {
                    callback(false);
                }

            })
        })
    },

    getPurchaseById: function(id,callback){
        MongoClient.connect(url,function (err,client) {
            var db = client.db(dbUrl);
            db.collection('purchase').findOne({'_id':id},function(err,result){
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

