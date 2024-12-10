const jwt = require("jsonwebtoken");
const userModel = require("../models/userModels");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({
        success: false,
        message: "Auth token missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      
      if (!user) {
        return res.status(401).send({
          success: false,
          message: "User not found",
        });
      }

      req.user = user;
      req.body.userId = user._id;
      next();
    } catch (jwtError) {
      console.error('JWT Verification Error:', jwtError);
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    return res.status(401).send({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};