const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyGroomerController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDocotrsController,
  bookeAppointmnetController,
  bookingAvailabilityController,
  userAppointmentsController,
  updateProfileController,
  updatePasswordController,
  bookAppointmentController,
  getUserAppointmentsController,
  updateAppointmentStatusController,
  getAllGroomersController,
  cancelAppointmentController,
  rescheduleAppointmentController,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

//router onject
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

//Auth || POST
router.post("/getUserData", authMiddleware, authController);

//APply Doctor || POST
router.post("/apply-groomer", applyGroomerController);

//GET ALL DOC
router.get("/getAllDoctors", authMiddleware, getAllDocotrsController);

//BOOK APPOINTMENT
router.post("/book-appointment", authMiddleware, bookAppointmentController);

//Booking Avliability
router.post(
  "/booking-availbility",
  authMiddleware,
  bookingAvailabilityController
);

//Appointments List
router.get("/user-appointments", authMiddleware, userAppointmentsController);

// UPDATE PROFILE
router.post("/update-profile", authMiddleware, updateProfileController);

// UPDATE PASSWORD
router.post("/update-password", authMiddleware, updatePasswordController);

// Get User Appointments
router.get("/appointments", authMiddleware, getUserAppointmentsController);

// Update Appointment Status
router.post("/update-appointment-status", authMiddleware, updateAppointmentStatusController);

// Get All Groomers
router.get("/getAllGroomers", authMiddleware, getAllGroomersController);

// Cancel Appointment
router.post("/cancel-appointment", authMiddleware, cancelAppointmentController);

// Reschedule Appointment
router.post("/reschedule-appointment", authMiddleware, rescheduleAppointmentController);

module.exports = router;