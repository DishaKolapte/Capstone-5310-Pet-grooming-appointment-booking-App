const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getGroomerInfoController,
  updateGroomerProfileController,
  getGroomerByIdController,
  getGroomerAppointmentsController,
  updateAppointmentStatusController,
  getGroomerProfileController
} = require("../controllers/groomerCtrl");

const router = express.Router();

// Get Groomer Info
router.post("/getGroomerInfo", authMiddleware, getGroomerInfoController);

// Update Groomer Profile
router.post("/updateProfile", authMiddleware, updateGroomerProfileController);

// Get Single Groomer
router.get("/getGroomerById/:id", authMiddleware, getGroomerByIdController);

// Get Groomer Appointments
router.get("/appointments", authMiddleware, getGroomerAppointmentsController);

// Update Appointment Status
router.post("/update-appointment-status", authMiddleware, updateAppointmentStatusController);

// Get Groomer Profile
router.get("/profile", authMiddleware, getGroomerProfileController);

module.exports = router; 