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
        type: String,
        required: true
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
    address: {
        type: String
    },
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


module.exports = mongoose.model('Station', StationSchema);