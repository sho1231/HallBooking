const joi = require('joi');

module.exports = {
    registration_schema: joi.object({
        email: joi.string().required(),
        name: joi.string().required(),
        pass: joi.string().required(),
        cpass: joi.ref('pass')
    }),
    login_schema: joi.object({
        email: joi.string().required(),
        pass: joi.string().required(),
    }),
    add_room: joi.object({
        roomName: joi.string().required(),
        numberOfSeats:joi.number().min(10).required(),
        amenties: joi.array().items(joi.string()).required(),
        price: joi.number().min(100).required(),
    }),
    booking: joi.object({
        date:joi.date().required(),
        stime:joi.string().required(),
        etime:joi.string().required(),
        roomId:joi.string().required(),
    }),
    async isError(schema, data) {
        try {
            // console.log(schema.validateAsync(data));
            await schema.validateAsync(data);
            return false;
        }
        catch ({ details: [error] }) {
            // console.log(err);
            console.log("Error from schema.js", error);
            return error.message;
        }
    }
}