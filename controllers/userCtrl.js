const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");
const groomerModel = require("../models/groomerModel");
const { sendEmail } = require('../utils/emailService');
//register callback
const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isGroomer: user.isGroomer,
        phone: user.phone,
        city: user.city
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error: error.message
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

// APpply DOctor CTRL
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notifcation = adminUser.notifcation;
    notifcation.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/docotrs",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notifcation });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied SUccessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error WHile Applying For Doctotr",
    });
  }
};

//GET ALL DOC
const getAllDocotrsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Docots Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Errro WHile Fetching DOcotr",
    });
  }
};

//BOOK APPOINTMENT
const bookAppointmentController = async (req, res) => {
  try {
    const {
      groomerId,
      date,
      time,
      petName,
      petType,
      services,
      notes
    } = req.body;

    const newAppointment = new appointmentModel({
      userId: req.body.userId,
      groomerId,
      petName,
      petType,
      services,
      date,
      time,
      notes,
      status: "pending"
    });

    await newAppointment.save();

    // Notify groomer
    const groomer = await groomerModel.findOne({ _id: groomerId });
    const user = await userModel.findOne({ _id: groomer.userId });
    
    if (user) {
      user.notification.push({
        type: "new-appointment-request",
        message: `New appointment request for ${date} at ${time}`,
        data: {
          appointmentId: newAppointment._id,
          date: date,
          time: time
        }
      });
      await user.save();
    }

    // Send email to groomer
    await sendEmail('newAppointment', {
      groomerEmail: groomer.email,
      date: req.body.date,
      time: req.body.time,
      petName: req.body.petName,
      services: req.body.services,
      notes: req.body.notes
    });

    res.status(200).send({
      success: true,
      message: "Appointment request sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while booking appointment",
    });
  }
};

// booking bookingAvailabilityController
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Availibale at this time",
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking",
    });
  }
};

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch SUccessfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
    });
  }
};

// Update profile
const updateProfileController = async (req, res) => {
  try {
    console.log('Update Profile Request:', req.body);
    const { userId, ...updateData } = req.body;
    
    // Find and update user
    const user = await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      console.log('User not found for ID:', userId);
      return res.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    // Remove password from response
    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      data: user
    });
  } catch (error) {
    console.log('Update Profile Error:', error);
    res.status(500).send({
      success: false,
      message: "Error in Profile Update",
      error: error.message
    });
  }
};

// Update password
const updatePasswordController = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    
    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password Updated Successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Password Update",
      error
    });
  }
};

const applyGroomerController = async (req, res) => {
  try {
    // Check if email already exists
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Email already registered. Please login or use a different email."
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user with groomer flag
    const newUser = new userModel({
      name: `${req.body.firstName} ${req.body.lastName}`,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      city: req.body.city,
      isGroomer: true
    });

    await newUser.save();

    // Create groomer profile
    const newGroomer = new groomerModel({
      userId: newUser._id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      city: req.body.city,
      experience: req.body.experience,
      services: req.body.services,
      petTypes: req.body.petTypes,
      basePrice: req.body.basePrice,
      about: req.body.about,
      status: "pending"
    });

    await newGroomer.save();

    // Notify admin
    const adminUser = await userModel.findOne({ isAdmin: true });
    if (adminUser) {
      adminUser.notification.push({
        type: "new-groomer-request",
        message: `${req.body.firstName} ${req.body.lastName} has applied for a groomer account`,
        data: {
          groomerId: newGroomer._id,
          name: `${req.body.firstName} ${req.body.lastName}`,
          onClickPath: "/admin/groomers"
        }
      });
      await adminUser.save();
    }

    res.status(201).send({
      success: true,
      message: "Application submitted successfully. Please login once approved."
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error while applying for groomer account"
    });
  }
};

// Get User Appointments
const getUserAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({ userId: req.body.userId })
      .populate('groomerId')
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching appointments",
    });
  }
};

// Update Appointment Status
const updateAppointmentStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status }
    );

    const user = await userModel.findOne({ _id: appointment.userId });
    if (user) {
      user.notification.push({
        type: "appointment-status-updated",
        message: `Your appointment status has been updated to ${status}`,
        data: {
          appointmentId: appointment._id,
          status: status
        }
      });
      await user.save();
    }

    res.status(200).send({
      success: true,
      message: "Appointment status updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating appointment status",
    });
  }
};

// Get All Groomers
const getAllGroomersController = async (req, res) => {
  try {
    const groomers = await groomerModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Groomers List Fetched Successfully",
      data: groomers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting groomers list",
    });
  }
};

// Cancel Appointment
const cancelAppointmentController = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status: "cancelled" }
    );

    // Get the user who made the appointment
    const appointmentUser = await userModel.findById(appointment.userId);

    // Notify groomer
    const groomer = await groomerModel.findById(appointment.groomerId);
    const groomerUser = await userModel.findById(groomer.userId);
    if (groomerUser) {
      groomerUser.notification.push({
        type: "appointment-cancelled",
        message: `Appointment for ${appointment.date} at ${appointment.time} has been cancelled`,
        data: {
          appointmentId: appointment._id,
          date: appointment.date,
          time: appointment.time
        }
      });
      await groomerUser.save();
    }

    // Send email to both user and groomer
    await sendEmail('appointmentCancelled', {
      recipientEmail: groomerUser.email,
      date: appointment.date,
      time: appointment.time
    });

    if (appointmentUser) {
      await sendEmail('appointmentCancelled', {
        recipientEmail: appointmentUser.email,
        date: appointment.date,
        time: appointment.time
      });
    }

    res.status(200).send({
      success: true,
      message: "Appointment cancelled successfully"
    });
  } catch (error) {
    console.error('Error in cancelAppointmentController:', error);
    res.status(500).send({
      success: false,
      message: "Error cancelling appointment",
      error
    });
  }
};

// Reschedule Appointment
const rescheduleAppointmentController = async (req, res) => {
  try {
    const { appointmentId, date, time } = req.body;
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { 
        date,
        time,
        status: "pending" // Reset to pending for groomer approval
      }
    );

    // Notify groomer
    const groomer = await groomerModel.findById(appointment.groomerId);
    const groomerUser = await userModel.findById(groomer.userId);
    if (groomerUser) {
      groomerUser.notification.push({
        type: "appointment-reschedule-request",
        message: `Reschedule request for appointment to ${date} at ${time}`,
        data: {
          appointmentId: appointment._id,
          date,
          time
        }
      });
      await groomerUser.save();
    }

    res.status(200).send({
      success: true,
      message: "Reschedule request sent successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error rescheduling appointment",
      error
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllDocotrsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
  updateProfileController,
  updatePasswordController,
  applyGroomerController,
  getUserAppointmentsController,
  updateAppointmentStatusController,
  getAllGroomersController,
  cancelAppointmentController,
  rescheduleAppointmentController
};
