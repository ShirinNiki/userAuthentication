import express from "express";
import cors from "cors";
//node js module.
import { readdirSync } from "fs";
//Cross-site request forgery (CSRF)
import csrf from "csurf";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
//in server end running: server receive in backend, will notice us n which endpoint it was sent with
//what method and what is staus code.
const morgan = require("morgan");

require("dotenv").config();

//apply csrf as middleware
const csrfProtection = csrf({ cookie: true });

//create express app
const app = express();

//db connection
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("db connect"))
  .catch((err) => console.log("db error connect", err));

//apply middlewaress
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

//each midleware can have 3 parameter:req,res, next
//next is necessery but req,res is optional

app.use((req, res, next) => {
  console.log("this is middleware");
  //to continue....
  //exp: if authenticate do .... and if not authenticate do ......
  next();
});

//route : comment is simlle way, instead I use readdirSync
// app.get("/", (req, res) => {
//   //
//   res.send("you hit server endpoint");
// });

//to read all the route we can use readdirSynch from fs package of node.js
//rooute recieve 'domain...../api/route'
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));
//csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

//get server config from .env
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`server is running on ${port}`));
