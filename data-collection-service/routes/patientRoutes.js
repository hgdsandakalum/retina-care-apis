const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

// Create a new patient
router.post("/", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      email,
      age,
      address,
      mobile,
      conditions,
    } = req.body;
    const newPatient = new Patient({
      firstName,
      lastName,
      gender,
      email,
      age,
      address,
      mobile,
      conditions,
    });
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific patient by ID
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.id });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a patient
router.put("/:id", async (req, res) => {
  try {
    const { firstName, lastName, gender, age, address, conditions } = req.body;
    const updatedPatient = await Patient.findOneAndUpdate(
      { patientId: req.params.id },
      { firstName, lastName, gender, age, address, conditions },
      { new: true, runValidators: true }
    );
    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(updatedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a patient
router.delete("/:id", async (req, res) => {
  try {
    const deletedPatient = await Patient.findOneAndDelete({
      patientId: req.params.id,
    });
    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
