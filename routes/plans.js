const express = require("express");
const router = express.Router();
const planController = require("../controllers/plansController.js");
const auth = require("../middleware/authMiddleware.js");

router.post("/create-plan", auth, planController.createPlan);

router.put("/update-plan/:planId", auth, planController.updatePlan); // new

router.post("/add-day/:planId", auth, planController.addDayToPlan); //new

router.post("/add-place-to-day/:planId/:dayNumber", auth, planController.editPlaceInDay); //new

router.put("/edit-place-in-day/:planId/:dayNumber/:placeInDayId", auth, planController.updatePlan); // new

router.put("/move-place/:planId", auth, planController.movePlaceToAnotherDay); // new

router.get('/get-public-plans', planController.getPublicPlans); //new

router.post('copy-plan/:planId', auth, planController.copyPublicPlan); //new

router.put('plan-sharing/:planId', auth, planController.togglePlanVisibility); //new

router.get("/user-plans", auth, planController.getUserPlans);

router.get("/get-plan/:planId", auth, planController.getPlanDetails);

router.delete("/delete-plan/:planId", auth, planController.deletePlan);

router.delete("/delete-day/:planId/:dayNumber", auth, planController.deleteDayFromPlan); //new

router.delete("/delete-day/:planId/:dayNumber/:placeInDayId", auth, planController.removePlaceFromDay); //new



