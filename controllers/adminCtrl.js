const groomerModel = require("../models/groomerModel");
const userModel = require("../models/userModels");
const { sendEmail } = require("../utils/emailService");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "Users data",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching users",
      error,
    });
  }
};

const getAllGroomersController = async (req, res) => {
  try {
    const groomers = await groomerModel.find({})
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Groomers data",
      data: groomers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching groomers",
      error,
    });
  }
};

const getPendingGroomersController = async (req, res) => {
  try {
    const pendingGroomers = await groomerModel.find({ status: "pending" })
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Pending groomers fetched successfully",
      data: pendingGroomers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching pending groomers",
      error,
    });
  }
};

const changeGroomerStatusController = async (req, res) => {
  try {
    const { groomerId, status } = req.body;
    
    // Find and update groomer status
    const groomer = await groomerModel.findByIdAndUpdate(
      groomerId,
      { status },
      { new: true }
    ).populate('userId');

    if (!groomer) {
      return res.status(404).send({
        success: false,
        message: "Groomer not found"
      });
    }

    // Find and update user's isGroomer status
    const user = await userModel.findById(groomer.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    // Update user's isGroomer status based on groomer status
    user.isGroomer = status === "approved";
    
    // Initialize notification array if it doesn't exist
    if (!user.notification) {
      user.notification = [];
    }

    // Add notification
    user.notification.push({
      type: "status-updated",
      message: `Your groomer account has been ${status}`,
      data: {
        status
      }
    });

    await user.save({ validateBeforeSave: false }); // Skip validation since we're only updating specific fields

    // Send email notification
    try {
      await sendEmail('statusUpdate', {
        recipientEmail: groomer.email,
        status: status,
        name: `${groomer.firstName} ${groomer.lastName}`
      });
    } catch (emailError) {
      console.error('Error sending status update email:', emailError);
    }

    res.status(200).send({
      success: true,
      message: "Groomer status updated successfully",
      data: groomer
    });

  } catch (error) {
    console.error('Error in changeGroomerStatusController:', error);
    res.status(500).send({
      success: false,
      message: "Error in changing groomer status",
      error: error.message
    });
  }
};

const getGroomerStatsController = async (req, res) => {
  try {
    const stats = {
      total: await groomerModel.countDocuments({}),
      approved: await groomerModel.countDocuments({ status: "approved" }),
      pending: await groomerModel.countDocuments({ status: "pending" }),
      blocked: await groomerModel.countDocuments({ status: "blocked" }),
    };
    
    res.status(200).send({
      success: true,
      message: "Groomer statistics fetched successfully",
      data: stats,
    });
  } catch (error) {
    console.error('Error in getGroomerStatsController:', error);
    res.status(500).send({
      success: false,
      message: "Error in fetching groomer statistics",
      error,
    });
  }
};

module.exports = {
  getAllUsersController,
  getAllGroomersController,
  getPendingGroomersController,
  changeGroomerStatusController,
  getGroomerStatsController,
};