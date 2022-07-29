'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var api = express();

// cargar rutas

var userRouter = require('./router/admin');


// middlewares

api.use(async (req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
}); 
const cors = require('cors')
api.use(cors());
api.use(bodyParser.urlencoded({extended:false}));
api.use(bodyParser.json());

// cors

// rutas

api.use('/', userRouter);


// exportar
module.exports = api;

