"use strict"

/* const, var or let */
    var mysql = require('mysql');
    const nodemailer = require("nodemailer");
    var bcrypt= require('bcrypt-nodejs');

    var {connectiondb, 
    encrypt,
    createToken,
    ComparenCryptPass,
    con,
    nodemail
    } = require('../config/admin');

/* funtion */
    //prueva
    
    //resgistro
    function save_user(req,res){

    var params = {
        name: req.body.name,
        subname: req.body.subname,
        password: req.body.password,
        email: req.body.email
    };

    if(params.name &&params.subname && params.email && params.password){
        var mailbody = "SELECT * FROM user WHERE email = "+ mysql.escape(params.email);

        connectiondb.query(mailbody, function(err, result){
            var password = encrypt(params.password,null);

            if(err) console.log(err);
            
            const valus = [[
                "UUID_SHORT()", 
                params.name,
                params.subname,
                params.name + params.subname,
                password,
                params.email,
                "Free",
                new Date()   
                ]];

            if( result < 1  ){
                connectiondb.query('INSERT INTO user (id_User ,name, subname, nick ,password, email, membership, created_at ) VALUES ?',[valus] ,function (err, result) {
                    console.log('hola mundo loco');
                    if (err) return console.log(err);
                    res.status(200).send({message: 'Enviado con exito'});
                });
            }else{
                res.status(200).send({ message:'Usted cuentas con una cuenta con nosotros, le pedimos que inicie secion con su correo electronico y contraseña.'});
            }

        });

    }else{
        res.status(200).send({message:'Envia todos los campos '});
    }
    
    }
    
    //login
    function login(req,res){

    var params = req.body;
    var selectemail = "SELECT * FROM user WHERE email = "+ mysql.escape(params.email);

    connectiondb.query( selectemail ,function(err,result){
        if(err) return res.status(404).send({message: err});

        if( result[0] ){
            var dbpassword = result[0].password;
            ComparenCryptPass(params.password, dbpassword,res, params,createToken(result));
            return;
        }else{
            return res.status(404).send({ message:'Favor de ingresar un correo o contraseña validas'});
        }
    });


    
    }
    
    //List de Usuarios
    function getUser(req,res){

    var UserID = req.params.id;
    var DBid = 'SELECT * FROM user WHERE id_User = '

    connectiondb.query(DBid + UserID, (err,Result)=>{
        if (err) return res.status(500).send({message: 'hay un error', err});
        if(Result[0]) return res.status(200).send({Result});
        return res.status(404).send({message: 'El usuariol no existe'});
    });
    }
    
    //actualizar los datos de un usuario
    function updateUser(req,res){

        // req
        var params = req.body;

        var models_exchange = [
            params.name,
            params.subname,
            params.subname+params.subname
            
        ]
        var insertPass = "INSERT INTO customers (name, subname) VALUES ?"+ [models_exchange];

        //Petition
        connectiondb.query( selectemail ,function(err,result){
            if(result[0]){
                console.log("Number of records deleted: " + result.affectedRows);
                connectiondb.query( insertPass ,function (err, result) {
                    if (err) return console.log;
                    res.status(200).send({message: 'Enviado con exito'+result[0]});
                });
            }else{
            }

        });
    }
    
    // actualizar contraseña
    function UpdatedPass (req, res){
        // req
        var params = req.body;
        var params_head = req.headers;
        
        //tokend
        var selectemail = "SELECT * FROM user WHERE ip = "+ mysql.escape();
        var deleted = "DELETE FROM customers WHERE address = 'Mountain 21'";
        var models_pass = [
            params.password
        ]
        var insertPass = "INSERT INTO customers (password ) VALUES ?"+ [models_pass];
        //peticion
        connectiondb.query( selectemail ,function(err,result){
            if(result[0]){
                connectiondb.query(deleted, ()=>{
                    if(err)return res.status(500).send({message: 'No hemos hacer el cambio de contraseña', err});
                });
                console.log("Number of records deleted: " + result.affectedRows);
                connectiondb.query( insertPass ,function (err, result) {
                    if (err) return console.log;
                    res.status(200).send({message: 'Enviado con exito'+result[0]});
                });
            }else{
            }
        
        });   
    }
    // Actualization email
    function UpdatedEmail (req, res){
        // req
        var params = req.body;
        var params_head = req.headers;
        
        //tokend
        var selectemail = "SELECT * FROM user WHERE ip = "+ mysql.escape();
        var models_pass = [
            params.email
        ]
        var insertPass = "INSERT INTO customers (password ) VALUES ?"+ [models_pass];
        //peticion
        connectiondb.query( selectemail ,function(err,result){
            if(result[0]){
                connectiondb.query( insertPass ,function (err, result) {
                    if (err) return console.log;
                    res.status(200).send({message: 'Enviado con exito'+result[0]});
                });
            }else{
            }
        
        });   
    }
    //Recovery Password
    function SendRecoveryPass (req,res){
        nodemail();
    }
    
module.exports = {
    save_user,
    login,
    getUser,
    updateUser,
    SendRecoveryPass
}