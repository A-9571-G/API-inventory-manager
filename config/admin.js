// var / const or let
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var moment = require('moment');
const nodemailer = require("nodemailer");
var fs = require('fs');
var path = require('path');
require('dotenv').config({path : './.env'}); 

// index
module.exports = {
  //conection 
    connectiondb :  mysql.createPool({
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD,
            database: process.env.DBDATABASE
        }),
        //created data base
        con : function (conection, models){ conection.query(models, function (err, result) {
          if (err){
            console.error('Error de conexion: ' + err.stack);
            return;
          }
          console.log("Created Table");
         });
        },
        //encript pasword : Pass
        encrypt : (password, saltRounds) => {
          return hash = bcrypt.hashSync(password, saltRounds);
        },
        //compare pasword : 
        ComparenCryptPass: async (password, dbpassword, res, params, Text) =>{
          bcrypt.compare(password, dbpassword, function(err, result ){
            if (err) return res.status(404).send({message: err});  
            if(result == true){
              if(params.getoken) return res.status(200).send({ token: Text});
              return res.status(200).send({message: 'Logeado exitozamente'});
            }else{
              return res.status(404).send({ message:'Favor de ingresar un correo o contraseña validas'});
            }
            
          });
        },
        //created tokend : 
        createToken : (result)=>{
          var secret = process.env.SECRET;
          var payload = {
            sub: result[0].id_User,
            name: result[0].name,
            subname: result[0].subname,
            nick: result[0].nick,
            membership: result[0].membership,
            email: result[0].email,
            image: result[0].image,
            iat: moment().unix(),
            exp: moment().add(30., 'days').unix
          }
          return jwt.encode(payload, secret);
        },
        // Midelware tokend : 
        Midelware: (req,res,next) =>{
          
          var jwt = require('jwt-simple');
          var moment = require('moment');
          var secret = process.env.SECRET;

          if(!req.headers.autorization){
              return res.status(403).send({message: 'la peticion no tiene la cabecera de autorization'});

          }
          var simbol = /(\d+(?:\.\d*)?)F\b/g;
          var token = req.headers.autorization.replace(simbol, ' ');

          try{

              var payload = jwt.decode(token,secret);
              if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'El tokend a experado'});
              } 
          }catch(ex){
              return res.status(404).send({message: 'El tokend no es valido'});
          }

          req.user=payload;
          next();

        },
        // Desemcript tokend:
         desecriptokend: async (token,data)=>{
          var secret = process.env.SECRET;
          var simbol = /(\d+(?:\.\d*)?)F\b/g;
          var token ;
          var desemcript = jwt.decode(token.replace(simbol, ' '),secret);
          return data.push(desemcript);
        },
        // Nodemailer: Send Email
        nodemail : (res)=>{
          try{

            //conection mail
            let transporter = nodemailer.createTransport({
                host: process.env.SMTPHOST,
                secure:false,
                port: process.env.SMTPPORT,
                auth: {
                    user: process.env.SMTPEMAIL,
                    pass: process.env.SMTPPASS
                }
              });
            //send mail
            let info =  transporter.sendMail({
                from: 'orlando.oconnell13@ethereal.email', // sender address
                to: "orlando.oconnell13@ethereal.email", // list of receivers
                subject: "Hello/ ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
              });
              console.log("Message sent: %s", info.messageId);
              console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

              return (
                transporter,
                info,
                res.status(200).send({ message:'login'})
              );

          }catch(err){
            return res.status(404).send({ message:err});
          }
        },
        // fs_remove
        fsremove: async(res,file_phath, message )=>{
          fs.unlink(file_phath, (err)=>{
            res.status(200).send({message: message});
          });
        },
        fsDeleted: async (file_phath)=>{
          fs.unlink(file_phath, (err)=>{
            if(err) return console.log(err);
          });
        }
        //simbol abs
        //simbol ABC
        //simbol '"#%&$/'
        

}

