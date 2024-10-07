const Plan = require("./models/Plan.js");

exports.createPlan = async (req, res) => {
  try {
    const { title, description, destination, isPublic } = req.body;
    const plan = new Plan({
      userId: req.user._id,
      title,
      description,
      destination,
      isPublic: isPublic || false,
      days: [],
    });
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.user._id });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getPlanDetails = async (req, res) => {
  try {
    const plan = await Plan.findOne({
      _id: req.params.planId,
      userId: req.user._id,
    });
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const result = await Plan.deleteOne({
      _id: req.params.planId,
      userId: req.user._id,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.json({ message: "Plan deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
