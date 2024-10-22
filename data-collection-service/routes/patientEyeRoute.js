const express = require("express");
const router = express.Router();
const PatientEye = require("../models/PatientEye");
const Patient = require("../models/Patient");
const upload = require("../config/multerConfig");
const axios = require("axios");
const path = require("path");
const FormData = require("form-data");
const fs = require("fs");

// Configure upload fields
// const uploadFields = upload.fields([
//   { name: "leftEyeImage", maxCount: 1 },
//   { name: "rightEyeImage", maxCount: 1 },
// ]);

// Preprocessing function
const preprocessImage = async (base64Image) => {
  if (!base64Image) {
    throw new Error("Error: Image data is undefined");
  }

  try {
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Image, "base64");

    const form = new FormData();
    form.append("image", imageBuffer, {
      filename: "image.png",
      contentType: "image/png",
    });

    const response = await axios.post(
      "http://localhost:5005/preprocess",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "Content-Type": "multipart/form-data",
        },
        responseType: "arraybuffer",
      }
    );

    // Convert the binary data to a base64 string
    const processedImageBase64 = Buffer.from(response.data, "binary").toString(
      "base64"
    );

    return processedImageBase64;
  } catch (error) {
    console.error("Error processing patientEye data:", error);
    throw error;
  }
};

// API endpoint for image upload
router.post("/upload", async (req, res) => {
  try {
    const { patientId, leftEyeImage, rightEyeImage } = req.body;

    if (!patientId) {
      throw new Error("Patient ID is required");
    }

    // Check if a document with the provided patientId exists
    const existingPatient = await Patient.findOne({ patientId: patientId });

    if (!existingPatient) {
      throw new Error("Patient with ID not found");
    }

    // Validate base64 strings
    if (!leftEyeImage || !rightEyeImage) {
      throw new Error("Both left and right eye images are required");
    }

    // Preprocess both images
    // const [processedLeftEye, processedRightEye] = await Promise.all([
    //   preprocessImage(leftEyeImage),
    //   preprocessImage(rightEyeImage),
    // ]);

    // Save the results in the PatientEye document
    const patientEyeData = {
      patientId: patientId,
      leftEyeImage: leftEyeImage,
      rightEyeImage: rightEyeImage,
    };

    // Find the existing PatientEye document or create a new one
    const patientEyeDocument = await PatientEye.findOneAndUpdate(
      { patientId: patientId }, // Find by patientId
      { $set: patientEyeData }, // Update the document with new data
      { new: true, upsert: true } // Return the new document, create it if it doesn't exist
    );

    res.json({
      message: "Images uploaded and patient data updated successfully",
      patientEyeDocument,
    });
  } catch (error) {
    console.error("Error saving patient data:", error);
    res
      .status(400)
      .json({ error: error.message || "Failed to save patient data" });
  }
});

// API endpoint to retrieve PatientEye data by patientId
router.get("/:patientId", async (req, res) => {
  try {
    const patientId = req.params.patientId;

    if (!patientId) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    // Retrieve the PatientEye document for the given patientId
    const patientEyeDocument = await PatientEye.findOne({
      patientId: patientId,
    });

    if (!patientEyeDocument) {
      return res.status(404).json({
        error: "No PatientEye data found for the provided Patient ID",
      });
    }

    // Send the PatientEye data back to the client
    res.json({
      message: "PatientEye data retrieved successfully",
      patientEyeData: patientEyeDocument,
    });
  } catch (error) {
    console.error("Error retrieving patientEye data:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to retrieve patientEye data" });
  }
});

module.exports = router;
