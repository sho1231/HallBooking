const mongo = require('../Shared/mongo');
const jwt = require('jsonwebtoken');
const { config } = require('dotenv');
const { login_schema, registration_schema, booking, isError } = require('../Shared/schema');
var moment = require('moment');
const { MongoInvalidArgumentError } = require('mongodb');
config();

module.exports = {
    async register(req, res) {
        try {
            const message = await isError(registration_schema, req.body);
            if (message) return res.status(500).json(message);
            const customer = await mongo.customers.findOne({ email: req.body.email });
            if (customer) return res.status(401).json({ message: "Customer with email id exists" });
            const newCustomer = await mongo.customers.insertOne(req.body);
            return res.status(200).json(newCustomer);
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Server error" });
        }
    },
    async login(req, res) {
        try {
            const message = await isError(login_schema, req.body);
            if (message) return res.status(500).json(message);
            const customer = await mongo.customers.findOne({ email: req.body.email });
            if (!customer) return res.status(404).json({ message: "Customer with this email does not exist" });
            if (customer.pass !== req.body.pass) return res.status(403).json({ message: "Wrong password" });
            const auth_token = jwt.sign({ _id: customer._id }, process.env.KEY, {
                expiresIn: "6h",
            });
            res.status(200).json({ message: "Login success", token: auth_token });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: "Server error" });
        }
    },
    async booking(req, res) {
        try {
            const message = await isError(booking, req.body);
            if (message) return res.status(500).json(message);
            if (!moment(req.body.date, 'l', true).isValid()) return res.status(500).json({ message: 'Invalid date' });
            let date = new Date(req.body.date);
            if (date < new Date()) return res.status(500).json({ message: "Invalid date" });
            const stime = moment(req.body.stime, "HH:mm");
            const etime = moment(req.body.etime, "HH:mm");
            console.log(etime.diff(stime,'minutes'));
            if (!stime.isBefore(etime)) return res.status(400).json({ message: "Invalid end time" });
            const customer = await mongo.customers.findOne({ _id: mongo.ObjectId(req.id) }, { projection: { name: 1 } });
            req.body.cust_name = customer.name;
            req.body.bookedStatus = true;
            const roomId = await mongo.rooms.findOne({ _id: mongo.ObjectId(req.body.roomId) });
            req.body.roomName=roomId.roomName;
            if (!roomId) return res.status(404).json({ message: 'Room not found' });
            req.body.price=(((etime.diff(stime,'minutes'))/60).toFixed(2))*roomId.price;
            const bookedWithThisRoomId = await mongo.bookings.find({ roomId: mongo.ObjectId(req.body.roomId) }).toArray();
            for (let i in bookedWithThisRoomId) {
                if (bookedWithThisRoomId[i].date === req.body.date) {
                    // console.log(bookedWithThisRoomId[i].date.toISOString(), req.body.date.toISOString())
                    return res.status(400).json({ message: "Not available at this date" });
                }
            }
            req.body.roomId = mongo.ObjectId(req.body.roomId);
            const booked = await mongo.bookings.insertOne(req.body);
            res.status(200).json(booked);
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: "Internal Error" });
        }
    }
}