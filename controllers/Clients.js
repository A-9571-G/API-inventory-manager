"use strict"
var mysql = require('mysql');
const nodemailer = require("nodemailer");
var bcrypt= require('bcrypt-nodejs');

var {
    connectiondb, 
    desecriptokend,
    fsremove,
    fsDeleted
} = require('../config/admin');
const { object_models } = require('../models/SQL/object_admin');
const { accessSync } = require('fs');

module.exports = {
    // Agregar cliente.
    insertclient: async(req, res)=>{
        var client = [];
        var simbol = /(\d+(?:\.\d*)?)ABCDFGHIJKLMNÑSPQRSTWXYZabcdefghijklmnñspqrstwxyzF\b/g;
        await desecriptokend(req.headers.autorization, client);
        var params = req.body;
        if( params.name ){
            connectiondb.query('SELECT * FROM user WHERE id_User ='+ client[0].sub, async (err, result)=>{
                if(result[0].id_User == client[0].sub ){
                    const valus = [[
                        result[0].id_User, 
                        params.name,
                        params.name+result[0].id_User,
                        params.description,
                        new Date() 
                    ]];
                    connectiondb.query('INSERT INTO clients (id_User, name, nick,description_product,created_at) VALUES ?',[valus] ,function (err, result) {
                        if (err) return res.status(500).send({message: 'No se pudo agregar el producto ' +err});
                        return res.status(200).send({message: 'Enviado con exito'});
                    });
                }else return res.status(500).send({message: 'El tokend es invalido'});
                if(err) res.status(500).send({message:'No cuentas con el permiso para agregar un producto'});
            });
        }else return res.status(404).send({messege: 'hay un error'});
    },
    // cambiar informacion del cliente
    updateClient: (req, res)=>{
        var client = [];
        desecriptokend(req.headers.autorization, client);
        var params = req.body;
    
        connectiondb.query('SELECT * FROM clients WHERE id_User ='+ client[0].sub, async (err, result)=>{
        if(result[0].id_User == client[0].sub ){
            if(params.name && params.description) return data(req, res, "name ='"+params.name+"', nick = '"+params.name + result[0].id_User+"' , description_product ='"+params.description);
            if(params.name) return data(req, res, "name ='"+params.name+"', nick = '"+params.name + result[0].id_User);
            if(params.description) return data(req, res, "description_product ='"+params.description);
        }else return res.status(500).send({message: 'El tokend es invalido'});
        if(err) res.status(500).send({message:'No cuentas con el permiso para agregar un producto'});
        });
    
        async function data (req,res, value){
            connectiondb.query("UPDATE clients SET "+value+"'  WHERE id_Client = '"+req.params.id+"'",function (err, result) {
                if (err) return res.status(500).send({message: 'No se pudo agregar el producto ' +err});
                return res.status(200).send({message: 'Enviado con exito'});
            });
        } 
    },
    // Subir contrato del cliente
    updateContract : async(req, res)=>{
        var params = req.params;
        var User = [];
        await desecriptokend(req.headers.autorization, User);
        connectiondb.query('SELECT * FROM clients WHERE id_User ='+User[0].sub, (err, result)=>{
            if(err) fsremove(res,file_phath,'No cuetas con el permiso necesario para hacer los cambios');

            if(result[0]) {
                contract(req,res);
            }else return res.status(404).send({message:'Lo sentimos no cuentas con el permiso necesario'})
                
            async function contract(req,res){
                if(req.file){
                    var file_phath = req.file.path;
                    var file_splite = file_phath.split('\\');
                    var file_name = file_splite[3];
                    var ext_split = req.file.mimetype.split('//');
                    var file_extend = ext_split[0];
    
                    if(file_extend == 'application/pdf'){    
                        connectiondb.query("UPDATE clients SET contrat ='"+file_name+"' WHERE id_Client = '"+params.id+"'" ,(err,result)=>{
                               if(err) return res.status(500).send({message: 'La imagen no se pudo subir correctamente'+err});
                               if(result) return res.status(200).send({message:'Imagen subida correctamente'});
                           });
                           var search =  result.filter(item =>item.id_Client == params.id);
                           fsDeleted('public/contract/clients/'+search[0].contrat);
    
                    }else{
                        fsremove(res, file_phath, 'Extencion no valida');
                    }
                }else return res.status(500).send({message: 'Ingresa un archivo valido'});
            } 
        });
        User = '';
    },
    // Eliminar cliente
    deleteClient : async(req, res)=>{
        var params = req.params;
    
        connectiondb.query('SELECT * FROM clients WHERE id_User ='+ params.id,(err, result)=>{
            if(err) return res.status(500).send({
                message:'hay un error'
            });
            if(result[0]) {
                return delted(req, res)
            }else return res.status(404).send({message: 'el cliente no se encuentra en nuestra base de datos'}) ;
        });
        async function delted(req, res){
            connectiondb.query("DELETE FROM clients WHERE id_client = '"+params.idproduct+"'", (err, result)=>{
                if(err) return res.status(500).send({message:'todo mal'+err});
                if(result) return res.status(200).send({message:'todo bien'});
            });
        }
    },
    //lista de clientes 
    listclient: async(req, res)=>{
        var params = req.params; 
        connectiondb.query( 'SELECT * FROM clients WHERE id_User ='+ params.id, (err, result)=>{
            if(err) return res.status(404).send({message:'hay un herror en la peticion'});
            if(result[0]){
                return res.status(200).send({message: result});
            }else return res.status(404).send({message:'No hay clientes registrados'});
        });
    }
}