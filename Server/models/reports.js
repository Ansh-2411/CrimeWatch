const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const timelineSchema = new Schema({
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: [
      "submitted",
      "received",
      "under_review",
      "approved",
      "investigating",
      "resolved",
      "closed",
      "rejected"
    ],
    required: true,
    default: "submitted"
  },
  note: { type: String, default: "" }
});
const reportSchema = new Schema({

  fullName: {
    type: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  email: {
    type: String,
  },
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
  crimeimageURLs: {
    type: [String],
    default: []
  },

  reportedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: [
      "submitted",
      "received",
      "under_review",
      "approved",
      "investigating",
      "resolved",
      "closed",
      "rejected"
    ],
    default: "submitted",
  },
  lastUpdated: { type: Date, default: Date.now },
  timeline: [timelineSchema],
  assignedTo: { type: String, default: "Not Assigned" }
});

// Create a geospatial index on the location field
reportSchema.index({ "location.coordinates": '2dsphere' });


module.exports = model("Reports", reportSchema);