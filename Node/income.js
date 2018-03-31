/**
 * Created by Валера on 07.03.2018.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017';
var dbUrl =('KS');
const uuidv1 = require('uuid/v1');

module.exports = {

    createIncome: function (title,description,ammount,type,userId,callback) {
        MongoClient.connect(url,function (err,client) {
            var db = client.db(dbUrl);
            db.collection('income').insertOne({
                "_id": uuidv1(),
                "title": title,
                "description": description,
                "ammount": ammount,
                "type": type,
                "userId": userId
            }, function (err, result) {
                assert.equal(err, null);
                console.log("Saved income.");
                if (result) {
                    callback(true);
                }
                else {
                    callback(false);
                }
            });
        })
    },
    getIncomes: function(userId,callback){
        MongoClient.connect(url,function (err,client) {
            var db = client.db(dbUrl);
            console.log(userId);
            db.collection('income').find({'userId':userId}).toArray(function (err,result) {
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
    getIncomeById: function(id,callback){
        MongoClient.connect(url,function (err,client) {
            var db = client.db(dbUrl);
            db.collection('income').findOne({'_id':id},function(err,result){
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

