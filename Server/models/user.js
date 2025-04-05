const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const {createTokenForUser,validateToken}=require("../services/auth");

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
    salt: {
        type: String,
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
userSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();

    const salt = randomBytes(16).toString();

    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest("hex");

    user.salt = salt;
    user.password = hashedPassword;

    next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("user not found");
    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedPassword = createHmac("sha256", salt)
        .update(password)
        .digest("hex");
    if (userProvidedPassword !==hashedPassword) throw new Error("incorrect password");
    const token=createTokenForUser(user);
    return token;
});

const User = model('user', userSchema);
module.exports = User;
