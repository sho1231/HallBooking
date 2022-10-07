const app = require("express").Router();

const { register, login } = require('../Services/admin.services');

app.post("/register",register);
app.post("/login",login);

module.exports = app;