const express = require("express");
const router = express.Router();
const planController = require("../controllers/plansController.js");
const auth = require("../middleware/authMiddleware.js");

router.post("/create-plan", auth, planController.createPlan);

router.get("/user-plans", auth, planController.getUserPlans);

router.get("/get-plan/:planId", auth, planController.getPlanDetails);

router.delete("/delete-plan/:planId", auth, planController.deletePlan);
