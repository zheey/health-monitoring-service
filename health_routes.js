var express = require('express');
var multer = require('multer');
var multerupload = multer({dest:'images/'});
module.exports = function (app) {
    var admin = require('./controller/admin_controller');
    app.use('/static', express.static('./static')).
        use('/images', express.static('images')).
        use('/node_modules', express.static('node_modules'));

    app.get('/', function (req, res) {
        if(req.session.userid){
            res.render('dashboard',{msg: req.session.msg});
        }else {
            res.redirect('/login');
        }
    });
    app.get('/login', function (req, res) {
        if (req.session.userid){
            res.redirect('/');
        }else{
            res.render('login',{msg: req.session.msg});
        }
    });
    app.get('/register', function (req, res) {
        //if (req.session.privilege === 'Admin') {
            res.render('register', {msg: req.session.msg});
        //}else {
          //  res.redirect('/');
       // }
    });
    app.get('/newdata', function (req, res) {
        if (req.session.privilege === 'Admin') {
            res.render('newdata', {errmsg: req.session.msg1});
        }else {
         res.redirect('/');
       }
    });
    app.get('/reports', function (req, res) {
        if (req.session.userid){
            res.render('report',{msgerr: req.session.msg1});
        }else{
            res.redirect('/login');
        }
    });
    app.get('/analytics', function (req, res) {
        if (req.session.userid){
            res.render('analytics',{msgerr: req.session.msg1});
        }else{
            res.redirect('/login');
        }
    });
    app.get('/logout', function (req, res) {
        req.session.destroy(function () {
            res.redirect('/login');
        });
    });

    app.post('/login', admin.login);
    app.post('/register', admin.register);
    app.post('/newdata/add', multerupload.any(), admin.addNewData);
    app.get('/report/get', admin.getReports);
    app.get('/report/set', admin.setReport);
    app.get('/user', admin.getUser);

};
