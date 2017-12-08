var express = require('express');
var router = express.Router();
var resume_dal = require('../model/resume_dal');
var account_dal = require('../model/account_dal');
//var address_dal = require('../model/address_dal');


// View All accounts
router.get('/all', function(req, res) {
    resume_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('resume/resumeViewAll', { 'result':result });
        }
    });

});

// View the account for the given id
router.get('/', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.getById(req.query.account_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('resume/resumeViewByID', {'account': result[0][0]});
            }
        });
    }
});

router.get('/add', function(req, res){
    resume_dal.getAddResume(req.query.account_id, function(err, result){
        if(err){
            res.send(err);
        }
        else{
            console.log(result);
            res.render('resume/resumeAdd',{'school':result[0], 'company':result[1], 'skill':result[2],'account_id':req.query.account_id});
        }
    });
});


router.get('/add/selectuser', function(req, res) {
    console.log(res);
    account_dal.getAll(function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
        }
        res.render('resume/resumeSelectUser', {'user': result});
    });
});


router.get('/insert', function(req, res){
    console.log(req.query);
    resume_dal.insert( req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                var resumeId = result.insertId;
                resume_dal.insertSkills( resumeId, req.query.skill_id, function(err,result) {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                else {
                    resume_dal.insertSchools( resumeId, req.query.school_id, function(err,result) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        }
                        else {
                            resume_dal.insertCompanies( resumeId, req.query.school_id, function(err, result) {
                                if(err) {
                                    console.log(err);
                                    res.send(err);
                                }
                                else {
                                    //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                                    res.redirect(302, '/resume/all');
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
