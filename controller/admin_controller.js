var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var async = require('async');
var nl2br = require('nl2br');
var mongoose = require('mongoose'),
    Workers = mongoose.model('Worker'),
    Reports = mongoose.model('Report'),
    Works = mongoose.model('Work'),
    Admin = mongoose.model('User');

function hashPW(pwd) {
    return crypto.createHash('sha256').update(pwd).
        digest('base64').toString();
}
exports.login = function (req, res) {
    Admin.findOne({username:req.body.loginname}).exec(function (err, user) {
        if(!user){
            err = 'User not found.';
        }else if (user.password === hashPW(req.body.loginpassword.toString())){
            req.session.regenerate(function () {
                req.session.userid = user.id;
                req.session.username = user.username;
                req.session.privilege = user.privilege;
                req.session.msg = 'Logged in as, ' + user.username;
                res.redirect('/');
            });
        } else {
        err = 'Authentication failed.';
    }
    if (err){
        req.session.regenerate(function () {
            req.session.msg = err;
            res.redirect('/login');
        });
    }
    });
};
exports.register = function (req, res) {
    var User = new Admin({username:req.body.username, password:hashPW(req.body.password),
    privilege:req.body.privilege});
    User.save(function (err, user) {
        if(err){
            res.render('register', function () {
                res.send(err);
            });
        }else {
            req.session.userid = user.id;
            req.session.username = user.username;
            req.session.privilege = user.privilege;
            req.session.msg = 'Logged in as, ' + user.username;
            res.redirect('/');
        }
    });
};
exports.getUser = function (req, res) {
    Admin.findOne({_id:req.session.userid}).exec(function (err, user) {
        if(!user){
            res.json(404, {err:'Error fetching out user\'s records. '});
        }else{
            res.json(user);
        }
    });
};
exports.addNewData = function (req, res) {
    // upload product image to file
    console.log("req", req.files);
    var filesArray = req.files;
    async.each(filesArray, function(file, eachcallback){
        if(file){
            var vaccinate = new Workers({morning:req.body.morning, afternoon:req.body.afternoon});

            var workers = new Workers({morning:req.body.wmorning, afternoon:req.body.wafternoon});

            var report = new Reports({dayschedule:req.body.schedule , vaccinated:[vaccinate.toObject()],
                availableworkers:[workers.toObject()],achievement:req.body.achievement,
                challenges:req.body.challenges,impact:req.body.impact,imagefile:file.filename});

            var work = new Works({workday:req.body.projectday, report:[report.toObject()]});
            work.save(function (err) {
                if(err){
                    req.session.msg1 = "Failed to save Report."+err;
                    res.render('newdata',{msg:req.session.msg1});
                } else {
                    req.session.msg1 = "Picture successfully uploaded";
                    res.redirect('/reports');
                }
            });
        }

    }, function (err) {
        if(err){
            console.log("error occured in each",+ err);
        } else {
            res.json(200, "Report successfully uploaded");
        }
    });

};
exports.getReports = function (req, res) {
  Works.find().exec(function (err, reports) {
      if (!reports){
          res.json(404, {msgerr: 'Sorry, no Report was found.'});
      }else {
          res.json(reports);
      }
  });
};
exports.setReport = function (req, res) {
    Works.findOne({workday:req.query.work})
        .exec(function (err, report) {
            if(!report){
                res.json(404, {msgerr:'Reports not found.'});
            } else {
                res.json(report);
            }
        });
};

