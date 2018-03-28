/**
 * Created by Валера on 07.03.2018.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017';
var dbUrl =('KS');
const uuidv1 = require('uuid/v1');

module.exports = {

    createPlace: function (title,latitude,longitude) {
        db.collection('user').insertOne( {
            "_id" : uuidv1(),
            "title": title,
            "latitude": latitude,
            "longitude": longitude
        },function(err, result){
            assert.equal(err, null);
            console.log("Saved the user sign up details.");
        });
    }

};