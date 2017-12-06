var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view company_view as
 select s.*, a.street, a.zip_code from company s
 join address a on a.address_id = s.address_id;

 */


exports.getAll = function(callback) {
    var query = 'SELECT * FROM account;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(account_id, callback) {
    var query = 'call account_getinfo(?)';
    var queryData = [account_id];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.getAddAccount = function( callback){
    var query = "call newaccount_getinfo();";
    console.log(query);
    connection.query(query, function(err, result){
        callback(err, result);
    });
};

exports.insert = function( params, callback) {
    var query = 'insert into account( email, first_name, last_name) values(? , ? , ?)';
    console.log(params);
    var queryData = [ params.email, params.first_name, params.last_name];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

exports.insertSkills = function( account_id, skill_id, callback) {
    var query = 'insert into account_skill( account_id, skill_id) values ?';

    var queryData = [ account_id, skill_id];
    var values = [];
    for( var i = 0 ; i < skill_id.length ; i++){
        values[i] = [ account_id, parseInt(skill_id[i]) ];
    }
    console.log(values);
    connection.query( query, [values], function(err, result) {
        callback(err, result);
    });
};


exports.insertCompanies = function( account_id, company_id, callback) {
    var query = 'insert into account_company( account_id, company_id) values ?';

    var queryData = [ account_id, company_id];
    var values = [];
    for( var i = 0 ; i < company_id.length ; i++){
        values[i] = [ account_id, parseInt(company_id[i]) ];
    }
    console.log(values);
    connection.query( query, [values], function(err, result) {
        callback(err, result);
    });
};

exports.insertSchools = function( account_id, school_id, callback) {
    var query = 'insert into account_school( account_id, school_id) values ?';

    var queryData = [ account_id, school_id];
    var values = [];
    console.log('account_id',account_id);
    console.log('school_id',school_id);
    for( var i = 0 ; i < school_id.length ; i++){
        values[i] = [ account_id, parseInt(school_id[i]) ];
    }
    connection.query( query, [values], function(err, result) {
        callback(err, result);
    });
};


exports.delete = function(company_id, callback) {
    var query = 'DELETE FROM account WHERE account_id = ?';
    var queryData = [company_id];
    console.log('delete', company_id);
    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

//declare the function so it can be used locally
var companyAddressInsert = function(company_id, addressIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO company_address (company_id, address_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var companyAddressData = [];
    if (addressIdArray.constructor === Array) {
        for (var i = 0; i < params.address_id.length; i++) {
            companyAddressData.push([company_id, params.address_id[i]]);
        }
    }
    else {
        companyAddressData.push([company_id, params.address_id]);
    }
    connection.query(query, [companyAddressData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.companyAddressInsert = companyAddressInsert;

//declare the function so it can be used locally
var companyAddressDeleteAll = function(company_id, callback){
    var query = 'DELETE FROM company_address WHERE company_id = ?';
    var queryData = [company_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.companyAddressDeleteAll = companyAddressDeleteAll;

exports.update = function(params, callback) {
    var query = 'UPDATE company SET company_name = ? WHERE company_id = ?';
    var queryData = [params.company_name, params.company_id];

    connection.query(query, queryData, function(err, result) {
        //delete company_address entries for this company
        companyAddressDeleteAll(params.company_id, function(err, result){

            if(params.address_id != null) {
                //insert company_address ids
                companyAddressInsert(params.company_id, params.address_id, function(err, result){
                    callback(err, result);
                });}
            else {
                callback(err, result);
            }
        });

    });
};



exports.edit = function(account_id, callback) {
    var query = 'CALL account_getinfo(?)';
    var queryData = [account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};