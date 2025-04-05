const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require('uuid');


const reportSchema = new Schema({
  reportId: { type: String, unique: true, required: true, default: uuidv4 }, 

  crimetype: {
    type: String,
    required: true,
    enum: ['Theft', 'Assault', 'Vandalism', 'Suspicious Activity', 'Other']
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
    address: { type: String }
  },
  crimeDate: {
    type: Date,
    required: true
  },
  crimeTime: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  crimeimageURL: {
    type: String,
    default: ''
  },
  reportedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a geospatial index on the location field
reportSchema.index({ "location.coordinates": '2dsphere' });


module.exports = model("Reports", reportSchema);