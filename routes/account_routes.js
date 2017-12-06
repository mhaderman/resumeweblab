var express = require('express');
var router = express.Router();
var account_dal = require('../model/account_dal');
//var address_dal = require('../model/address_dal');


// View All accounts
router.get('/all', function(req, res) {
    account_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('account/accountViewAll', { 'result':result });
        }
    });

});

// View the account for the given id
router.get('/', function(req, res){
    if(req.query.account_id == null) {
        res.send('account_id is null');
    }
    else {
        account_dal.getById(req.query.account_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('account/accountViewById', {'account': result[0][0]});
            }
        });
    }
});

router.get('/add', function(req, res){
    account_dal.getAddAccount(function(err, result){
        if(err){
            res.send(err);
        }
        else{
            res.render('account/accountAdd',{'school':result[0], 'skill':result[1], 'company':result[2]});
        }
    });
});

router.get('/insert', function(req, res){
    console.log(req.query);
    account_dal.insert( req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                var accountId = result.insertId;
                account_dal.insertSkills( accountId, req.query.skill_id, function(err,result) {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                else {
                    account_dal.insertSchools( accountId, req.query.school_id, function(err,result) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        }
                        else {
                            account_dal.insertCompanies( accountId, req.query.school_id, function(err, result) {
                                if(err) {
                                    console.log(err);
                                    res.send(err);
                                }
                                else {
                                    //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                                    res.redirect(302, '/account/all');
                                }
                            })
                        }});

                }});
            }
        });
});

router.get('/edit', function(req, res){
    if(req.query.account_id == null) {
        res.send('A account id is required');
    }
    else {
        account_dal.edit(req.query.account_id, function(err, result){
            res.render('account/accountUpdate', {account: result[0][0], address: result[1]});
        });
    }

});

router.get('/edit2', function(req, res){
    if(req.query.account_id == null) {
        res.send('A account id is required');
    }
    else {
        account_dal.getById(req.query.account_id, function(err, account){
            address_dal.getAll(function(err, address) {
                res.render('account/accountUpdate', {account: account[0], address: address});
            });
        });
    }

});

router.get('/update', function(req, res) {
    account_dal.update(req.query, function(err, result){
        res.redirect(302, '/account/all');
    });
});

// Delete a account for the given account_id
router.get('/delete', function(req, res){
    if(req.query.account_id == null) {
        res.send('account_id is null');
    }
    else {
        account_dal.delete(req.query.account_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/account/all');
            }
        });
    }
});

module.exports = router;
