var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.getAll = function(callback) {
    var query = 'SELECT * FROM address;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function( address_id, callback) {
    var query = "select * from address where address_id = ?";

    connection.query( query, address_id, function( err, result) {
        callback(err, result);
    });
};

exports.insert = function( street, zip_code){
    var query = "insert into address( street, zip_code) values(?, ?)";
    var queryData = [ ]

};

exports.edit = function( address_id,  callback){
    var query = "call address_getinfo(?)";
    var args = [ address_id ];

    connection.query( query, args, function( err, result) {
        callback(err , result);
    });
};

exports.addressDeleteAll = function( address_id, callback) {
    var query = "delete from address where address_id = ?";
    var args = [address_id];
    connection.query( query, args, function( err, result){
        callback( err, result);
    });
};

//module.exports.addressDeleteAll = addressDeleteAll;

exports.update = function( street, zip_code, address_id, callback) {
    var query = "update address set street = ? , zip_code = ? where address_id = ?";
    var args = [street, zip_code, address_id];
    connection.query( query, args, function( err, result){
        callback( err, result);
    });
};













