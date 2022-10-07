const app = require("express").Router();

const {booking}=require('../Services/user.services');

app.post("/book",booking);

module.exports=app;