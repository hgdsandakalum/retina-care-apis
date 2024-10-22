const mongoose = require("mongoose");

const PatientEyeSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true,
  },
  leftEyeImage: {
    type: String,
    required: true,
  },
  rightEyeImage: {
    type: String,
    required: true,
  },
});

// Create an index on patientId for efficient searching
PatientEyeSchema.index({ patientId: 1 }, { unique: true });

module.exports = mongoose.model("PatientEye", PatientEyeSchema);
