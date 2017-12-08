var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);



exports.getAll = function(callback) {
    var query = 'select first_name, last_name, resume_name from account\n' +
        'left join resume r on r.account_id = account.account_id order by first_name;';

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

exports.getAddResume = function( account_id, callback){
    var query = "call resume_new_getinfo(?);";
    var queryData = [account_id];

    console.log(account_id,'account_id');
    connection.query(query, queryData, function(err, result){
        callback(err, result);
    });
};

exports.insert = function( params, callback) {
    var query = 'insert into resume( account_id, resume_name) values(? , ?)';
    console.log(params);
    var queryData = [ params.account_id, params.resume_name];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

exports.insertSkills = function( resume_id, skill_id, callback) {
    var query = 'insert into resume_skill( resume_id, skill_id) values ?';

    var queryData = [ resume_id, skill_id];
    var values = [];
    for( var i = 0 ; i < skill_id.length ; i++){
        values[i] = [ resume_id, parseInt(skill_id[i]) ];
    }
    console.log(values);
    connection.query( query, [values], function(err, result) {
        callback(err, result);
    });
};


exports.insertCompanies = function( resume_id, company_id, callback) {
    var query = 'insert into resume_company( resume_id, company_id) values ?';

    var queryData = [ resume_id, company_id];
    var values = [];
    for( var i = 0 ; i < company_id.length ; i++){
        values[i] = [ resume_id, parseInt(company_id[i]) ];
    }
    console.log(values);
    connection.query( query, [values], function(err, result) {
        callback(err, result);
    });
};

exports.insertSchools = function( resume_id, school_id, callback) {
    var query = 'insert into resume_school( resume_id, school_id) values ?';

    var queryData = [ resume_id, school_id];
    var values = [];
    console.log('account_id',resume_id);
    console.log('school_id',school_id);
    for( var i = 0 ; i < school_id.length ; i++){
        values[i] = [ resume_id, parseInt(school_id[i]) ];
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