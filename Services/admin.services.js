const mongo = require('../Shared/mongo');
const jwt = require('jsonwebtoken');
const { config } = require('dotenv');
const { login_schema, registration_schema, add_room, isError } = require('../Shared/schema')
config();

module.exports = {
    async register(req, res) {
        try {
            const message = await isError(registration_schema, req.body);
            if (message) return res.status(500).json(message);
            const admin = await mongo.admin.findOne({ email: req.body.email });
            if (admin) return res.status(401).json({ message: "Admin with email id exists" });
            const newAdmin = await mongo.admin.insertOne(req.body);
            return res.status(200).json(newAdmin);
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
            const admin = await mongo.admin.findOne({ email: req.body.email });
            if (!admin) return res.status(404).json({ message: "Admin with this email does not exist" });
            if (admin.pass !== req.body.pass) return res.status(403).json({ message: "Wrong password" });
            const auth_token = jwt.sign({ _id: admin._id }, process.env.KEY, {
                expiresIn: "6h",
            });
            res.status(200).json({ message: "Login success", token: auth_token });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: "Server error" });
        }
    },
    async roomCreation(req, res) {
        try {
            const isAdmin = await mongo.admin.findOne({ _id: mongo.ObjectId(req.id) });
            if (!isAdmin) return res.status(403).json({ message: "Can only be accessed by admin" });
            const message = await isError(add_room, req.body);
            if (message) return res.status(500).json({ message: message });
            const room = await mongo.rooms.findOne({ roomName: req.body.roomName });
            if (room) return res.status(400).json({ message: "Room already exist" });
            req.body.available = req.body.numberOfSeats;
            req.body.createdBy = mongo.ObjectId(req.id);
            const newRoom = await mongo.rooms.insertOne(req.body);
            res.status(200).json(newRoom);
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: "Internal error" });
        }
    },
    async getRoomsWithBookedData(req, res) {
        try {
            const admin = await mongo.admin.findOne({ _id: mongo.ObjectId(req.id) });
            if (!admin) return res.status(403).json({ message: "Can only be done by admin" });
            const data = await mongo.bookings.find({}, { projection: { _id: 0, price: 0, roomId: 0 } }).toArray();
            res.status(200).json(data)
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: "Internal Error" });
        }
    },
    async getCustomersWithBookedData(req, res) {
        try {
            const admin = await mongo.admin.findOne({ _id: mongo.ObjectId(req.id) });
            if (!admin) return res.status(403).json({ message: "Can only be done by admin" });
            const data = await mongo.bookings.find({}, { projection: { _id: 0, roomId: 0, bookedStatus: 0, price: 0 } }).toArray();
            res.status(200).json(data)
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: "Internal Error" });
        }
    }
}