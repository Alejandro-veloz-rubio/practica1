'use strict'
const express = require('express'),
        cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const md5 = require('md5');
const connection = require('./bd/mysql.js')
const app = express();

//acomodar
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'));
app.set('view engine', 'pug');
    app.use(cookieParser());
    app.use(session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 60000
        }
    }));


app.get('/', function(req,res,next){
    if(req.session.username){
        res.render('home',{username:req.session.username, email:req.session.email});
    }else{
    res.render('login')
    }
})

app.get('/registro', function(req, res) {
    res.render('registro');
});

app.post('/registroUser', function(req, res) {
    if(req.body.registro == ""){
        let pass  = (req.body.pass)
        connection.query('INSERT INTO datos(username, correo, pass) VALUES (?, ?, ?)',[req.body.username, req.body.email, pass], function(err, result, fields){
            
            if (err) throw err;
            res.redirect('/')
            
        })
       }else{
        res.redirect('/')
       }
});


app.post('/auth', function(req,res,next){
    if(req.body.sign_in==""){
        let pass = req.body.pass

        var sql = 'SELECT id, username, correo FROM datos WHERE username = "' + req.body.username + '" AND pass = "' + pass + '"';    
            console.log(sql);
        connection.query(sql, function(err, resp, fields){
            if(resp.length){
                console.log(resp[0].id);
                req.session.userid = resp[0].id;
                req.session.username = resp[0].username;
                req.session.email = resp[0].correo;
                res.redirect('/')
            }else{
                res.redirect('/404')
            }
        });
    }else{
        res.redirect('/registro')
    }
});

app.post('/getsal', function(req,res){
    let sql = 'SELECT * FROM livechat.grupos';
    connection.query(sql, function(err,resp){
        if(resp.length){
            res.send(resp);
        }else{
            res.send(false);
        }
    });
});

app.post('/addroom',function(req,res){
    let sql1 = 'INSERT INTO livechat.grupos (nombre_sala) VALUES("'+req.body.name+'")';
    connection.query(sql1, function(err,res){
        if(err){
            console.log('error')
        }
    });
});

app.get('/sesion', function(req,res,next){
    res.send(req.session);
});

app.get('/cerrar', function(req,res,next){
    req.session.destroy();
})


app.listen(8080);