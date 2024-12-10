const express = require("express");
const {
  getAllUsersController,
  getAllGroomersController,
  changeGroomerStatusController,
  getGroomerStatsController,
} = require("../controllers/adminCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/getAllUsers", authMiddleware, adminMiddleware, getAllUsersController);
router.get("/getAllGroomers", authMiddleware, adminMiddleware, getAllGroomersController);
router.post("/changeGroomerStatus", authMiddleware, adminMiddleware, changeGroomerStatusController);
router.get("/groomer-stats", authMiddleware, adminMiddleware, getGroomerStatsController);

module.exports = router;