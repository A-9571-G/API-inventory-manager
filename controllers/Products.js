"use strict"
var mysql = require('mysql');
const nodemailer = require("nodemailer");
var bcrypt= require('bcrypt-nodejs');

var {connectiondb,
nodemail,
desecriptokend,
fsremove
} = require('../config/admin');
const { object_models } = require('../models/SQL/object_admin');
const { accessSync } = require('fs');

module.exports = {

    // Agregar productos.
    product_up:  async (req,res)=>{
        var client = [];
        var simbol = /(\d+(?:\.\d*)?)ABCDFGHIJKLMNÑSPQRSTWXYZabcdefghijklmnñspqrstwxyzF\b/g;
        await desecriptokend(req.headers.autorization, client);
        var params = req.body;

        if(params.name &&params.stock && params.price){
            connectiondb.query('SELECT * FROM User WHERE id_User ='+ client[0].sub, async (err, result)=>{
                if(result[0].id_User == client[0].sub ){
                    var id_product = 5;
                    const valus = [[
                        result[0].id_User, 
                        params.name,
                        params.name+-result[0].id_User,
                        params.stock.replace(simbol,''),
                        params.price.replace(simbol,''),
                        params.description,
                        new Date() 
                    ]];
                    connectiondb.query('INSERT INTO product (id_User, name, nick,stock,price,description_product,created_at) VALUES ?',[valus] ,function (err, result) {
                        if (err) return res.status(500).send({message: 'No se pudo agregar el producto'});
                        return res.status(200).send({message: 'Enviado con exito'});
                    });
                }else return res.status(500).send({message: 'El tokend es invalido'});
                if(err) res.status(500).send({message:'No cuentas con el permiso para agregar un producto'});
            });
        }else return res.status(500).send({message:'Llena todos los campos'});
        var client = [];
    // accion de prueva
        },
    //Actualizar imagen del producto
    Uploadimage :async (req,res)=>{
        var User = [];
        await desecriptokend(req.headers.autorization, User);

        connectiondb.query('SELECT * FROM product WHERE id_User ='+ User[0].sub, (err, result)=>{
            if(result[0]) {
                updateimage(req,res);
            }else return res.status(404).send({message:'Lo sentimos no cuentas con el permiso necesario'})

            async function updateimage(req,res){
                if(req.file){
                    var file_phath = req.file.path;
                    var file_splite = file_phath.split('\\');
                    var file_name = file_splite[3];
                    var ext_split = req.file.mimetype.split('//');
                    var file_extend = ext_split[0];

                if(file_extend == 'image/png' || file_extend == 'image/jpg' || file_extend == 'image/jpeg' || file_extend == 'image/gif'){

                     connectiondb.query("UPDATE product SET image_product ='"+file_name+"' WHERE id_product = '"+req.body.product+"'" ,(err,result)=>{
                            if(err) return res.status(500).send({message: 'La imagen no se pudo subir correctamente'+err});
                            if(result) return res.status(200).send({message:'Imagen subida correctamente'});
                        });

                    }else{
                        fsremove(res, file_phath, 'Extencion no valida');
                    }
                }else return res.status(500).send({message: 'Ingresa un archivo valido'});
            } 
            if(err) fsremove(res,file_phath,'No cuetas con el permiso necesario para hacer los cambios');
        });
        var User = [];
    },
    // Actualizar productos Vendidos
    UpSold: async(req, res)=>{
        var params = req.body;
        var User = [];
        await desecriptokend(req.headers.autorization, User);
    
        connectiondb.query('SELECT * FROM product WHERE id_User ='+ User[0].sub, (err, result)=>{
            // conditional
            if(result[0]) {
                return updateimage(req,res, result);
            }else return res.status(404).send({message:'Lo sentimos no cuentas con el permiso necesario'})

            //funtion
            async function updateimage(req,res, result){
                var search = result.filter(item => item.id_product == req.params.id);
                if(params.sale && search[0]) {
                    Update(req, res, search);

                }else return res.status(500).send({message:'Favor de llenare el compo correspondiente'});
            }
            async function Update (req, res,search){
                var newstok = search[0].stock - params.sale; 
                if(params.sale <= search[0].stock){
                    connectiondb.query("UPDATE product SET Sale ='"+params.sale+"', stock ='"+newstok+"' WHERE id_product = '"+req.params.id+"'" ,(err,result)=>{
                        if(err) return res.status(500).send({message: 'La imagen no se pudo subir correctamente'+err});
                        if(result) res.status(200).send({message: 'hemos subido la imagen correctamente'});
                    });
                }else{
                    res.status(200).send({message: 'No puedes subir un valor mas alto del que tienes en stock'})
                }
            }
            // delted data
            var User = [];
        });
    },
    // update stock
    updatestock: async(req, res)=>{
        var params = req.body;
        var User = [];
        await desecriptokend(req.headers.autorization, User);
    
        connectiondb.query('SELECT * FROM product WHERE id_User ='+ User[0].sub, (err, result)=>{
            // conditional
            if(result[0]) {
                return updatestock(req,res, result);
            }else return res.status(404).send({message:'Lo sentimos no cuentas con el permiso necesario'})

            //funtion
            async function updatestock(req,res, result){
                var search = result.filter(item => item.id_product == req.params.id);
                console.log(params.stock);
                if(params.stock || search[0]) {
                    console.log('todo bien');
                    Update(req, res);

                }else return res.status(500).send({message:'Favor de llenare el compo correspondiente'});
            }
            async function Update (req, res){
                connectiondb.query("UPDATE product SET stock ='"+params.stock+"' WHERE id_product = '"+req.params.id+"'" ,(err,result)=>{
                    if(err) return res.status(500).send({message: 'El producto no se pudo subir correctamente'+err});
                    if(result) res.status(200).send({message: 'hemos subido la imagen correctamente'});
                });
            }
            // delted data
            var User = [];
        });
    },
    // cambio de informaicon
    updatepropduct: async(req,res)=>{
        var params = req.body;

        connectiondb.query('SELECT * FROM product WHERE id_User ='+ req.params.id, (err, result)=>{
            // conditional
            if(result[0]) {
                return updateproduct(req,res, result);
            }else return res.status(404).send({message:'Lo sentimos no cuentas con el permiso necesario'});
            
            //funtion
            async function updateproduct(req,res, result){

                var search = result.filter(item => item.id_product == req.params.idProduct);

                if(params.name && params.price && params.description )return UpdateGeneral(req, res,search);
                if(params.name && params.price)return UpdatePlus({
                    req, 
                    res,
                    search, 
                    name:  "name",
                    name2: "price",
                    data:params.name,
                    data2: params.price
                });;
                if(params.name && params.description)return UpdatePlus({
                    req, 
                    res,
                    search, 
                    name:  "name",
                    name2: "description_product",
                    data:params.name,
                    data2: params.description
                });;
                if(params.price && params.description)return UpdatePlus({
                    req, 
                    res,
                    search, 
                    name:  "price",
                    name2: "description_product",
                    data:params.price,
                    data2: params.description
                });
                if(params.name)return Update(req, res,search,"name",params.name );
                if(params.price)return Update(req, res,search,"price",params.price );;
                if(params.description)return Update(req, res,search,"description",params.description );;
            }
            async function Update (req, res,search, name, data){
                if(search[0]){
                    connectiondb.query("UPDATE product SET "+name+" ='"+data+"', nick = '"+search[0].name+req.params.idProduct+"' WHERE id_product = '"+req.params.idProduct+"'" ,(err,result)=>{
                        if(err) return res.status(500).send({message: 'La imagen no se pudo subir correctamente'+err});
                        if(result) res.status(200).send({message: 'hemos subido la imagen correctamente'});
                    });
                }else{
                    res.status(200).send({message: 'El producto mol existe'})
                }
            }
            async function UpdatePlus ({
                req, 
                res,
                search,
                name,
                name2,
                data,
                data2
            }){
                if(search[0]){
                    connectiondb.query("UPDATE product SET "+name+" ='"+data+"', "+name2+" ='"+data2+"',nick = '"+search[0].name+req.params.idProduct+"' WHERE id_product = '"+req.params.idProduct+"'" ,(err,result)=>{
                        if(err) return res.status(500).send({message: 'La imagen no se pudo subir correctamente'+err});
                        if(result) res.status(200).send({message: 'hemos subido la imagen correctamente'});
                    });
                }else{
                    res.status(200).send({message: 'El producto mol existe'})
                }
            }
            async function UpdateGeneral (req, res,search){
                if(search[0]){
                    connectiondb.query("UPDATE product SET name ='"+params.name+"', price ='"+params.price+"', description_product ='"+params.description+"', nick = '"+search[0].name+req.params.idProduct+"' WHERE id_product = '"+req.params.idProduct+"'" ,(err,result)=>{
                        if(err) return res.status(500).send({message: 'La imagen no se pudo subir correctamente'+err});
                        if(result) res.status(200).send({message: 'hemos subido la imagen correctamente'});
                    });
                }else{
                    res.status(200).send({message: 'El producto mol existe'})
                }
            }
        });
    },
    // lista de productos
    listproduct : async(req,res)=>{
        var params = req.body;

        connectiondb.query('SELECT * FROM product WHERE id_User ='+ req.params.id, (err, result)=>{
            // conditional
            if(result[0]) {
                return res.status(200).send({message: result});
            }else return res.status(404).send({message:'Lo sentimos no cuentas con el permiso necesario'});
        });
    },
    // eliminar producto
    deleted: async(req, res)=>{
        var params = req.body;

        connectiondb.query('SELECT * FROM product WHERE id_User ='+ req.params.id, (err, result)=>{
            // conditional
            if(result[0]) {
                return deleted(req,res);
            }else return res.status(404).send({message:'Lo sentimos no cuentas con el permiso necesario'});
        });
        async function deleted(req,res){
            connectiondb.query("DELETE FROM product WHERE id_product = '"+req.params.idProduct+"'", (err,result)=>{
                if(err) return res.status(500).send({message: err});
                if(result) return res.status(200).send({message: 'todo bien todo correcto'});
            });
        }
    },
    // QR 
    
    // Envio de QR
    home : async (req,res)=>{
        res.status(200).send({
            message: 'accion de prueba ejecutada correctamente'
        });
        }
}