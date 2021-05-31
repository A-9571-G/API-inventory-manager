'use strict'

var mongoose = require ('mongoose');
var app = require('./app');
var port = 3800;


//coneccion de la base de datos
mongoose.promise = global.promise;
mongoose.connect("mongodb://localhost:27017/225712", { useNewUrlParser: true , useUnifiedTopology: true  })
    .then(() => {
        console.log("la la conecion es corecta");

        //crear servidor
        app.listen(port, () =>{
               console.log('servidor coriendo corecta mente en la web: http:localhost:3800');
        });

    })
    .catch(err => console.log(err))
