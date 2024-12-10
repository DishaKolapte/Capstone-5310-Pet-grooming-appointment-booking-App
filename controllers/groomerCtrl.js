const groomerModel = require("../models/groomerModel");
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModels");
const { sendEmail } = require('../utils/emailService');

// Get Groomer Info
const getGroomerInfoController = async (req, res) => {
  try {
    const groomer = await groomerModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Groomer data fetched successfully",
      data: groomer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching groomer details",
    });
  }
};

// Update Groomer Profile
const updateGroomerProfileController = async (req, res) => {
  try {
    const groomer = await groomerModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Groomer profile updated",
      data: groomer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating groomer profile",
    });
  }
};

// Get Single Groomer
const getGroomerByIdController = async (req, res) => {
  try {
    const groomer = await groomerModel.findById(req.params.id);
    if (!groomer) {
      return res.status(404).send({
        success: false,
        message: "Groomer not found"
      });
    }
    res.status(200).send({
      success: true,
      message: "Groomer info fetched successfully",
      data: groomer
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting groomer info",
      error
    });
  }
};

// Get Available Groomers
const getAvailableGroomersController = async (req, res) => {
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

// Get Groomer Appointments
const getGroomerAppointmentsController = async (req, res) => {
  try {
    // First get the groomer profile using userId
    const groomer = await groomerModel.findOne({ userId: req.body.userId });
    
    if (!groomer) {
      return res.status(404).send({
        success: false,
        message: "Groomer not found"
      });
    }

    // Then get appointments for this groomer
    const appointments = await appointmentModel
      .find({ groomerId: groomer._id })
      .populate('userId', 'name email')  // Populate user details if needed
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Groomer Appointments fetched Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting groomer appointments",
    });
  }
};

// Update Appointment Status
const updateAppointmentStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    
    // First find the appointment and update it
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true } // This returns the updated document
    );

    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found"
      });
    }

    // Find the groomer for this appointment
    const groomer = await groomerModel.findById(appointment.groomerId);
    if (!groomer) {
      return res.status(404).send({
        success: false,
        message: "Groomer not found"
      });
    }

    // Find and notify the user
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

      // Send email notification if appointment is approved
      if (status === 'approved') {
        try {
          await sendEmail('appointmentConfirmed', {
            userEmail: user.email,
            date: appointment.date,
            time: appointment.time,
            groomerName: `${groomer.firstName} ${groomer.lastName}`,
            groomerCity: groomer.city
          });
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          // Continue execution even if email fails
        }
      }
    }

    res.status(200).send({
      success: true,
      message: "Appointment status updated",
      data: appointment
    });
  } catch (error) {
    console.error('Error in updateAppointmentStatusController:', error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating appointment status",
    });
  }
};

// Get Groomer Profile
const getGroomerProfileController = async (req, res) => {
  try {
    const groomer = await groomerModel.findOne({ userId: req.body.userId });
    if (!groomer) {
      return res.status(404).send({
        success: false,
        message: "Groomer profile not found"
      });
    }

    res.status(200).send({
      success: true,
      message: "Groomer profile fetched successfully",
      data: groomer
    });
  } catch (error) {
    console.error('Error in getGroomerProfileController:', error);
    res.status(500).send({
      success: false,
      message: "Error fetching groomer profile",
      error
    });
  }
};

module.exports = {
  getGroomerInfoController,
  updateGroomerProfileController,
  getGroomerByIdController,
  getAvailableGroomersController,
  getGroomerAppointmentsController,
  updateAppointmentStatusController,
  getGroomerProfileController,
}; 