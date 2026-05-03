const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "banking_app"
});

db.connect(err => {
  if(err) throw err;
  console.log("MySQL Connected");
});

app.post("/signup",(req,res)=>{
  const {name,email,password} = req.body;
  const sql = "INSERT INTO users(name,email,password) VALUES(?,?,?)";
  db.query(sql,[name,email,password],(err,result)=>{
    if(err) throw err;
    res.send("User Registered");
  });
});

app.post("/login",(req,res)=>{
  const {email,password} = req.body;
  const sql = "SELECT * FROM users WHERE email=? AND password=?";
  db.query(sql,[email,password],(err,result)=>{
    if(result.length>0){
      res.send(result[0]);
    } else{
      res.send("Invalid Login");
    }
  });
});

app.post("/transfer",(req,res)=>{
  const {sender,receiver,amount} = req.body;

  const deduct = "UPDATE users SET balance = balance - ? WHERE email=?";
  const add = "UPDATE users SET balance = balance + ? WHERE email=?";
  const trans = "INSERT INTO transactions(sender_email,receiver_email,amount) VALUES(?,?,?)";

  db.query(deduct,[amount,sender]);
  db.query(add,[amount,receiver]);
  db.query(trans,[sender,receiver,amount]);

  res.send("Transfer Successful");
});

app.get("/statement",(req,res)=>{
  db.query("SELECT * FROM transactions",(err,result)=>{
    res.json(result);
  });
});

app.listen(3000,()=>{
  console.log("Server running on port 3000");
});