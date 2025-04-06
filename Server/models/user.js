const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // location: {
    //     type: { type: String, enum: ["Point"], default: "Point" },
    //     coordinates: { type: [Number], required: true },
    //   },

}, { timestamps: true });

userSchema.index({ location: "2dsphere" });



const User = model('user', userSchema);
module.exports = User;
