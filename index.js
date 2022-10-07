const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongo = require('./Shared/mongo');
const user_auth=require('./Routes/user_authoriaztion.routes');
const admin_auth=require('./Routes/admin_authorization.routes');
const admin_actions=require('./Routes/admin_action.routes');
const {maintain,check}=require('./Shared/middleware');
const user_actions=require('./Routes/user_action.routes');
const { admin } = require('./Shared/mongo');
dotenv.config();

(async () => {
    try {
        app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
        await mongo.connect();
        app.use(maintain);
        app.use(express.json());
        app.get("/",(req,res)=>res.send("Running"));
        app.use("/users",user_auth);
        app.use("/admin",admin_auth);
        app.use(check);
        app.use("/admin",admin_actions);
        app.use("/users",user_actions);
    }
    catch (e) {

    }
})()