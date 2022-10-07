const app = require("express").Router();

const { roomCreation, getRoomsWithBookedData, getCustomersWithBookedData } = require('../Services/admin.services');

app.post("/createRoom", roomCreation);
app.get("/roomsBookedData", getRoomsWithBookedData);
app.get("/customersBookedData", getCustomersWithBookedData);

module.exports = app;