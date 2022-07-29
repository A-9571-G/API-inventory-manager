module.exports ={
    USER :[
        
        " id_User INT(16)  PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT   ",
        " name VARCHAR(50) NOT NULL ",
        "subname VARCHAR(50) ",
        "email VARCHAR(80) NOT NULL UNIQUE ",
        "password VARCHAR(250) NOT NULL ",
        "nick VARCHAR(100)  ",
        "membership VARCHAR(80) " ,
        "birth_date DATE  ",
        "created_at TIMESTAMP NULL  ",
        "updated_at TIMESTAMP NULL  ",
        "timeUsout DATETIME NULL  " ,
        "timeUsput DATETIME NULL  " 
    ],
    
    client : [
        "id_Client INT(16)  PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT",
        "id_User INT , FOREIGN KEY (id_User) REFERENCES User(id_User)",
        "name VARCHAR(150)",
        "total_prod_prov INT",
        "description_product VARCHAR(1000)",
        'nick VARCHAR(150)',
        "created_at TIMESTAMP NULL",
        "updated_at TIMESTAMP NULL",
        "contrat VARCHAR(150)"
    ],
    Product: [
        "id_product INT(16)  PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT ",
        "id_User INT , FOREIGN KEY (id_User) REFERENCES User(id_User) ",
        'id_Client INT , FOREIGN KEY (id_Client) REFERENCES Clients(id_Client)  ',
        'Status VARCHAR(150)',
        "name VARCHAR(150)  ", 
        "stock INT  ",
        "Sale INT",
        "description_product VARCHAR(1000)  ",
        'price INT ',
        'nick VARCHAR(150) ',
        "created_at TIMESTAMP NULL  ",
        "updated_at TIMESTAMP NULL ",
        "image_product VARCHAR(200) ",
        'QR VARCHAR(200)'
    ],
    Estadistic: [
        "id_product INT , FOREIGN KEY (id_product) REFERENCES product(id_product)",
        "id_User INT , FOREIGN KEY (id_User) REFERENCES User(id_User) ",
        "name VARCHAR(150) ", 
        "stock INT",
        "Sale INT",
        "price INT",
        "created_at TIMESTAMP NULL  ",
        "updated_at TIMESTAMP NULL ",
    ]
}