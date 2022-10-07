const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('dotenv');
config();

const mongo = {
    db: null,
    customers: null,
    admin: null,
    rooms: null,
    bookings: null,
    ObjectId,
    async connect() {
        try {
            const client = new MongoClient(process.env.MONGO_URL);
            await client.connect();
            this.db = client.db("HallBooking");
            this.customers = await this.db.collection("customers");
            this.admin = await this.db.collection("admin");
            this.rooms = await this.db.collection("rooms");
            this.bookings = await this.db.collection("bookings");
            console.log("Mongo connection established");
        }
        catch (e) {
            console.log(e);
        }
    }
}

module.exports = mongo;
