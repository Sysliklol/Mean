/**
 * Created by Валера on 07.03.2018.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017';
var dbUrl =('KS');
const uuidv1 = require('uuid/v1');

module.exports = {

    createPurchase: function (title,type,cost,quantity,placeId,userId,callback) {
        MongoClient.connect(url,function (err,client) {
            var db = client.db(dbUrl);


            db.collection('transactions').insertOne( {
                "_id" : uuidv1(),
                "title": title,
                "image": type,
                "cost":cost,
                "quantity":quantity,
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
            db.collection('transactions').find({'userId':userId}).toArray(function (err,result) {
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
            db.collection('transactions').findOne({'_id':id},function(err,result){
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

    deletePurchase: function(id,callback){
        MongoClient.connect(url,function (err,client) {
            var db = client.db(dbUrl);
            db.collection('transactions').deleteOne({'_id':id},function(err,result){
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

