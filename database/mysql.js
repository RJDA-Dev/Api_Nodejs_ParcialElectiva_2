const { process_params } = require("express/lib/router");
const mysql = require ("mysql");

const connection =mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
}); 


connection.connect((err) => {
    if (err) {
      console.log("Error:"+err) 
      return;
       
    }
    console.log("Conectado");
  });
  
  
  module.exports = connection