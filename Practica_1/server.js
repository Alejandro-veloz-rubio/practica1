'use strict'
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const md5 = require('md5');
const connection = require('./bd/mysql')
const bodyParser= require('body-parser')

app.use(bodyParser.urlencoded({extended: false } ) );
app.use(express.static('public'));
app.set ('view engine','pug')
app.use(cookieParser());

app.use(session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized:true, 
        cookie:{maxAge:6000} }) );

app.get('/',function(req,res){
    res.render('index')
})

/*app.get ('/',function (req, res, next){
    if(req.session.views){
        req.session.views++
        res.setHeader('Content-Type', 'text/html')
        res.write('<p>views: '+req.session.views+'</p>')
        res.write('<p> expires in:'+(req.session.cookie.maxAge / 1000)+'s/</p>')
        res.end()
    }else{
        req.session.views = 1;
        res.end('welcome to the session demo, refresh!');
    }
})*/

app.post('/auth',function (req,res,next){
    if(req.body.sign_in == ""){
        let pass = md5(req.body.pass);
        var sql= 'SELECT id, username, email, pass FROM Movies.sign_in_users WHERE email = "'+req.body.email+'" AND pass ="'+pass+'"';

        connection.query(sql, function(err, resp,fields){
            if(resp.length){
                console.log(resp[0].id);
                req.session.userid = resp[0].id;
                req.session.username = resp[0].username;
                req.session.correo = resp[0].email;
                res.redirect('/session');
            }else{
                res.redirect('/404');
            }
        });
        
    }else{
        res.redirect('/registro');
    }

});

app.get('/session', function (req, res, next){
  res.send(req.session);
});

app.get('/cerrar', function (req, res, next){
    req.session.destroy();
  });


app.post()

app.listen(78);
