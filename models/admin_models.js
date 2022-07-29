"use strict"

const { json } = require("body-parser");
const {USER,
    client,
    Product,
    Estadistic} = require('./SQL/object_admin');

module.exports = {
    User :  "CREATE TABLE User("+USER+")",
    Clients  : "CREATE TABLE Clients("+client+")",
    Product  : "CREATE TABLE Product("+Product+")ENGINE=INNODB ",
    Estadistic  : "CREATE TABLE Estadistic("+Estadistic+")",

}