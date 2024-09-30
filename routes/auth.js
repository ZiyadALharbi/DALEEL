const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.get("/profile", authMiddleware, authController.getCurrentUser);

router.post("/change-password", authMiddleware, authController.changePassword);

router.delete("/delete-account", authMiddleware, authController.deleteAccount);

module.exports = router;
