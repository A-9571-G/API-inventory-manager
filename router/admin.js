"use strict"

var express = require('express');
var {
    ControllerProducts,
    controllerUser,
    controllerClient
    } = require('../controllers/adminController');
var multer = require('multer');
const {Midelware} = require('../config/admin');
var api = express.Router();

//Midelware
var md_upload = multer({dest: 'public/uploaders/products'}).single('image');
var mdContract = multer({dest: 'public/contract/clients'}).single('contract');


// User

api.post('/register',controllerUser.save_user);
api.post('/login',controllerUser.login);
api.get('/user/:id', Midelware, controllerUser.getUser);
api.put('/update_user/:id', Midelware,controllerUser.updateUser);
api.get('/exchagePass', Midelware,controllerUser.SendRecoveryPass);


// Product

api.post('/InsertProduct', Midelware, ControllerProducts.product_up );
api.get('/',ControllerProducts.home);
api.post('/uploadimage',[Midelware, md_upload], ControllerProducts.Uploadimage);
api.post('/product/UpSold/:id', Midelware,ControllerProducts.UpSold);
api.post('/product/UpdateStock/:id', Midelware,ControllerProducts.updatestock);
api.post('/product/updateproduct/:id/:idProduct', Midelware,ControllerProducts.updatepropduct);
api.get('/product/listin/:id/:idProduct', Midelware,ControllerProducts.listproduct);
api.post('/product/deleted/:id/:idProduct', Midelware,ControllerProducts.deleted);

// Provedor or clients
api.post('/clients/insert', Midelware, controllerClient.insertclient);
api.post('/clients/updateclients/:id', Midelware, controllerClient.updateClient);
api.post('/clients/deleted/:id/:idproduct', Midelware, controllerClient.deleteClient);
api.post('/clients/listing/:id', Midelware, controllerClient.listclient);
api.post('/clients/contract/:id', [Midelware, mdContract], controllerClient.updateContract);

// Data

module.exports = api;