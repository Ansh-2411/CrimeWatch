const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Station Schema
const StationSchema = new Schema({
    stationName: {
        type: String,
        required: true
    },
    stationCode: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        },
        address: {
            type: String
        }
    },
    // jurisdictionArea: {
    //   type: String
    // },
    phoneNumber: {
        type: String
    },
    // email: {
    //   type: String
    // },
    // establishedDate: {
    //   type: Date
    // },
    stationPI: {
        type: Schema.Types.ObjectId,
        ref: 'PoliceUser'
    },
    // totalCapacity: {
    //   type: Number
    // },
    // status: {
    //   type: String,
    //   enum: ['Active', 'Inactive', 'Under Maintenance'],
    //   default: 'Active'
    // }
}, {
    timestamps: true
});

StationSchema.index({ "location": "2dsphere" });


module.exports = mongoose.model('Station', StationSchema);