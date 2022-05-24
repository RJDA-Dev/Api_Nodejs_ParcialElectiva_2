const express = require ("express");
const { append, send, json } = require("express/lib/response");
const app =express();

const port = 3001;
const dotenv =require ("dotenv");
dotenv.config({path:'./env/.env'});
const bodyParser =require('body-parser')
const jwt = require('jsonwebtoken')
const secret = "Soyuntokensocio"

const connection = require('./database/mysql');
const jsonwebtoken = require("jsonwebtoken");

app.get("/auth/:Test", (req, res) => {

     const Test = req.params.Test


  res.send(Test)
});

app.use(bodyParser.json());


//Login

app.post("/login/:usuario/:contrasena", (req, res) => {


  const { usuario, contrasena } = req.params;
  const sql = ` SELECT * FROM login  WHERE usuario = '${usuario}' and pass = '${contrasena}' `

  

  connection.query(sql, (error,response) => {

    if (error) throw error;
    console.log(response.length)
    if (response.length >= 1) {
 
        jsonToken = jwt.sign({
          contrasena: response.pass,
        }, secret)
        res.json({ "Estado": true, "token": jsonToken })
       
    }else{
      res.json({
        Estado:false
      })
    }

 
  })


});


//lista de vehiculo//

app.get("/Listvehiculo/", (req, res) => {

  const sql= 'select v.id_vehiculo, v.placa, u.nombre, v.tipo_vehiculo, d.hora_entrada, d.hora_salida from detalle d inner join vehiculo v on v.placa = d.id_placa inner join usuario u on u.id_cedula = d.id_usuario;'

  connection.query(sql,(error,results)=>{

if (error) throw error;
if(results.length>0){
   
  console.log(results)
res.json({
  vehiculo:results,
  Estado:true
});

}else{

res.json({

Estado:false,mensaje:"No hubo ningun carro ingresado",
vehiculo:null


})

}
  })

  
});


//ingresar vehiculo//Erorr sintaxis

app.post("/AddVehiculo/", (req, res) => {

 
  const customerObj0={

    Placa: req.body.placa,
    Tipo: req.body.Tipo_Vehiculo
  
  }
  const customerObj1={

    Nombre: req.body.Nombre,
    Cedula: req.body.Cedula,
    Telefono: req.body.Telefono,
    Correo: req.body.Correo,
    Direccion: req.body.Direccion,
    Sexo: req.body.Sexo,

     
  }
  const customerObj2={

     Hora_Entrada: req.body.Hora_Entrada,
     Hora_Salida	: req.body.Hora_Salida,
     Id_Placa: req.body.Id_Placa,
     Id_Usuario	: req.body.Id_Usuario,
     id_Detalle: req.body.id_Detalle,
     Sede: req.body.Sede,
  }

  connection.query(`INSERT INTO Vehiculo (Placa,Tipo_Vehiculo) Values ("${ req.body.Placa}","${ req.body.Tipo_Vehiculo}")`, error=>{
    if (error) throw error;
     
           
  });

  connection.query(`INSERT INTO Usuario (Nombre,Id_Cedula,Telefono,Correo,Direccion,Sexo) Values ("${ req.body.Nombre}","${ req.body.Cedula}","${ req.body.Telefono}","${ req.body.Correo}","${ req.body.Direccion}","${ req.body.Sexo}")`, error=>{
    if (error) throw error;
     

  });

  connection.query(`INSERT INTO detalle ( Id_Placa,Hora_Entrada,Hora_Salida,Id_Usuario,id_Detalle,Sede) Values  ("${ req.body.Id_Placa}","${ req.body.Hora_Entrada}","${ req.body.Hora_Salida}","${ req.body.Id_Usuario}","${ req.body.id_Detalle}","${ req.body.Sede}")`, error=>{
    if (error) throw error;
 
  });

  res.json({Estado:true})

 });
 


//retirar vehiculo//
app.delete("/RetirarVehiculo/:id", (req, res) => {

  const { id } = req.params;
  const sql = `DELETE FROM "detalle" WHERE id_Detalle = ${id} `;

  connection.query(sql, (error, response) => {

    if (error) throw error;



  })
  res.json({Estado:true})

});


//retirar vehiculo//
//app.delete("/RetirarVehiculo/:id", (req, res) => {
  //const { id } = req.params;
  //const sql = `DELETE FROM "vehiculo" WHERE id_Vehiculo = ${id} `;
  //connection.query(sql, (err, result) => {
   // if (err) throw err;
    //console.log("Eliminado");
 // });
//});

//Modificar//

app.put("/Modificar/:id/:Cedula", (req, res) => {
  const { id } = req.params;
  const { Cedula } = req.params;
  const customerObj0={

     Tipo: req.body.Tipo_Vehiculo
  
  }
  const customerObj1={

    Nombre: req.body.Nombre,
    Telefono: req.body.Telefono,
    Correo: req.body.Correo,
    Direccion: req.body.Direccion,
    Sexo: req.body.Sexo,

     
  }
   
  connection.query(`UPDATE vehiculo SET Tipo_Vehiculo="${ req.body.Tipo_Vehiculo}" WHERE Id_Vehiculo = ${id} `, error=>{
    if (error) throw error;

            
  });

  connection.query(`UPDATE  usuario SET Nombre="${ req.body.Nombre}",Telefono="${ req.body.Telefono}",Correo="${ req.body.Correo}",Direccion="${ req.body.Direccion}",Sexo="${ req.body.Sexo}" WHERE id_Cedula = ${Cedula} `, error=>{
    if (error) throw error;

    

  });

   
  res.json({Estado:true})

 });
 



//filtrar, senteicas de mysql//

app.get("/Filtrar/:Placa/:Propietario", (req, res) => {

  const{placa,propietario}=req.params;
  const sql= `select v.id_vehiculo, v.placa, u.nombre, v.tipo_vehiculo, d.hora_entrada, d.hora_salida from detalle d inner join vehiculo v on v.placa = d.id_placa inner join usuario u on u.id_cedula = d.id_usuario ORDER BY v.Id_Vehiculo`

  connection.query(sql,error=>{

if(error) throw error;
    
res.send('Vehiculo Filtrado')

  })


 });



 









app.listen(port, () => {
    console.log("La App Esta En linea");
  });
  