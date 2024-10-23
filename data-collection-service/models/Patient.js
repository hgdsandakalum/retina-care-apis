const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
    conditions: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Function to generate patient ID
function generatePatientId() {
  const timestamp = Date.now().toString();
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `P${timestamp}${randomNum}`;
}

// Pre-save hook to set patientId if not provided
PatientSchema.pre("save", async function (next) {
  if (!this.patientId) {
    let patientId;
    let isUnique = false;
    while (!isUnique) {
      patientId = generatePatientId();
      // Check if the generated ID already exists
      const existingPatient = await this.constructor.findOne({ patientId });
      if (!existingPatient) {
        isUnique = true;
      }
    }
    this.patientId = patientId;
  }
  next();
});

// Create an index on patientId for efficient searching
PatientSchema.index({ patientId: 1 }, { unique: true });

module.exports = mongoose.model("Patient", PatientSchema);
