const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PoliceUserSchema = new Schema({
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    badgeNumber: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    rank: {
        type: String,
        enum:['ADMIN', 'DGP', 'DIG', 'DSP', 'IPS', 'PI', 'PSI', 'HEAD_CONSTABLE', 'CONSTABLE'],
        required: true
    },
    superior: {
        type: Schema.Types.ObjectId,
        ref: 'PoliceUser'
    },
    station: {
        type: Schema.Types.ObjectId,
        ref: 'Station',
        // required: true
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String
    },
    contactNumber: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    joiningDate: {
        type: Date,
        required: true
    },
    rankLevel: {
        type: Number,
        required: true
    },
    // profilePhotoUrl: {
    //   type: String
    // },
    status: {
        type: String,
        enum: ['Active', 'On Leave', 'Suspended', 'Retired', 'Transferred'],
        default: 'Active'
    },
    // permissions: {
    //   canViewAllStations: {
    //     type: Boolean,
    //     default: false
    //   },
    //   canManageUsers: {
    //     type: Boolean,
    //     default: false
    //   },
    //   canViewAllReports: {
    //     type: Boolean,
    //     default: false
    //   },
    //   canEditAllReports: {
    //     type: Boolean,
    //     default: false
    //   },
    //   canViewStatistics: {
    //     type: Boolean,
    //     default: false
    //   },
    //   canManageSystem: {
    //     type: Boolean,
    //     default: false
    //   }
    // }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('PoliceUser', PoliceUserSchema);