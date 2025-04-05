const { Schema, model } = require("mongoose");

const notificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["INFO", "ALERT", "WARNING"],
        default: "INFO",
    },
    scope: {
        type: String,
        enum: ["LOCAL", "NATIONAL","REPORTUPDATE"],
        required: true,
    },
    location:{
        type: String,
    },
}, { timestamps: true });

notificationSchema.index({ location: "2dsphere" });
const Notification = model("notification", notificationSchema);
module.exports = Notification;
