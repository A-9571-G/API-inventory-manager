"use strict"
//models
const {User,
      Clients,
      Product,
      Estadistic
    } = require('./models/admin_models');

const {con, connectiondb } = require('./config/admin');
// base
const mysql = require("mysql");
var app = require('./app');

//connect data base
connectiondb.getConnection((err) =>{
  if (err) {
    console.error('Error de conexion: ' + err.stack);
    return;
  }else{

    //comprovation

    var table = {
      Utable : 'SELECT * FROM User',
      Ptable :  'SELECT * FROM product',
      prov : ' SELECT * FROM Clients ',
      estaditic: 'SELECT * FROM estadistic'

    }

    // create table db
    connectiondb.query( table.estaditic && table.Utable && table.Ptable && table.prov , function (err, result) {
      if (err){
        console.log(Product);

        con(connectiondb,User);
        con(connectiondb,Clients);
        con(connectiondb,Product);
        con(connectiondb,Estadistic);
      }

    });

    // Comprovacion de coneccion
    console.log('Conectado a la base de datos');
  }
});


//funcines de créacion de base de datos

app.listen(3050, () => {
  console.log("Seridor en puerto 3050 ... ");
});
