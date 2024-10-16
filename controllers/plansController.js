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

exports.updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const updates = req.body;

    const plan = await Plan.findOne({ _id: planId, userId: req.user._id });

    if (!plan) {
      return res.status(404).json({ error: "Plan not found." });
    }

    Object.assign(plan, updates, { updatedAt: Date.now() });

    await plan.save();

    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.addDayToPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { dayNumber, date } = req.body;

    const plan = await Plan.findOne({ _id: planId, userId: req.user._id });

    if (!plan) {
      return res.status(404).json({ error: "Plan not found." });
    }

    const newDayNumber = dayNumber || plan.days.length + 1;

    if (plan.days.some((day) => day.dayNumber === newDayNumber)) {
      return res
        .status(400)
        .json({ error: "Day number already exists in this plan." });
    }

    const newDay = {
      dayNumber: newDayNumber,
      date,
      places: [],
    };

    plan.days.push(newDay);
    plan.duration = plan.days.length;
    plan.updatedAt = Date.now();

    await plan.save();

    res.status(201).json(newDay);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteDayFromPlan = async (req, res) => {
  try {
    const { planId, dayNumber } = req.params;

    const plan = await Plan.findOne({ _id: planId, userId: req.user._id });

    if (!plan) {
      return res.status(404).json({ error: "Plan not found." });
    }

    const dayIndex = plan.days.findIndex(
      (day) => day.dayNumber === parseInt(dayNumber)
    );

    if (dayIndex === -1) {
      return res.status(404).json({ error: "Day not found in this plan." });
    }

    plan.days.splice(dayIndex, 1);

    for (let i = dayIndex; i < plan.days.length; i++) {
      plan.days[i].dayNumber -= 1;
    }

    plan.duration = plan.days.length;
    plan.updatedAt = Date.now();

    await plan.save();

    res.json({ message: "Day deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.addPlaceToDay = async (req, res) => {
  try {
    const { planId, dayNumber } = req.params;
    const { placeId, visitTime, notes, photosLinks, order } = req.body;

    const plan = await Plan.findOne({ _id: planId, userId: req.user._id });

    if (!plan) {
      return res.status(404).json({ error: "Plan not found." });
    }

    const day = plan.days.find((day) => day.dayNumber === parseInt(dayNumber));

    if (!day) {
      return res.status(404).json({ error: "Day not found in this plan." });
    }

    const newPlaceInDay = {
      placeId,
      visitTime,
      notes,
      photosLinks,
      order: order || day.places.length + 1,
      addedAt: Date.now(),
    };

    day.places.push(newPlaceInDay);
    plan.updatedAt = Date.now();

    await plan.save();

    res.status(201).json(newPlaceInDay);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.editPlaceInDay = async (req, res) => {
  try {
    const { planId, dayNumber, placeInDayId } = req.params;
    const updates = req.body;

    const plan = await Plan.findOne({ _id: planId, userId: req.user._id });

    if (!plan) {
      return res.status(404).json({ error: "Plan not found." });
    }

    const day = plan.days.find((day) => day.dayNumber === parseInt(dayNumber));

    if (!day) {
      return res.status(404).json({ error: "Day not found in this plan." });
    }

    const placeInDay = day.places.id(placeInDayId);

    if (!placeInDay) {
      return res.status(404).json({ error: "Place not found in this day." });
    }

    Object.assign(placeInDay, updates, { updatedAt: Date.now() });

    plan.updatedAt = Date.now();
    await plan.save();

    res.json(placeInDay);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.movePlaceToAnotherDay = async (req, res) => {
  try {
    const { planId } = req.params;
    const { fromDayNumber, toDayNumber, placeInDayId } = req.body;

    const plan = await Plan.findOne({ _id: planId, userId: req.user._id });

    if (!plan) {
      return res.status(404).json({ error: "Plan not found." });
    }

    const fromDay = plan.days.find(
      (day) => day.dayNumber === parseInt(fromDayNumber)
    );
    const toDay = plan.days.find(
      (day) => day.dayNumber === parseInt(toDayNumber)
    );

    if (!fromDay || !toDay) {
      return res.status(404).json({ error: "Day not found in this plan." });
    }

    const placeIndex = fromDay.places.findIndex(
      (place) => place._id.toString() === placeInDayId
    );

    if (placeIndex === -1) {
      return res.status(404).json({ error: "Place not found in the fromDay." });
    }

    const [placeInDay] = fromDay.places.splice(placeIndex, 1);

    placeInDay.order = req.body.order || toDay.places.length + 1;

    toDay.places.push(placeInDay);

    plan.updatedAt = Date.now();
    await plan.save();

    res.json({ message: "Place moved successfully." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.removePlaceFromDay = async (req, res) => {
  try {
    const { planId, dayNumber, placeInDayId } = req.params;

    const plan = await Plan.findOne({ _id: planId, userId: req.user._id });

    if (!plan) {
      return res.status(404).json({ error: "Plan not found." });
    }

    const day = plan.days.find((day) => day.dayNumber === parseInt(dayNumber));

    if (!day) {
      return res.status(404).json({ error: "Day not found in this plan." });
    }

    const placeIndex = day.places.findIndex(
      (place) => place._id.toString() === placeInDayId
    );

    if (placeIndex === -1) {
      return res.status(404).json({ error: "Place not found in this day." });
    }

    day.places.splice(placeIndex, 1);

    plan.updatedAt = Date.now();
    await plan.save();

    res.json({ message: "Place removed from day." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getPublicPlans = async (req, res) => {
  try {
    const publicPlans = await Plan.find({ isPublic: true }).populate(
      "userId",
      "username"
    );

    res.json(publicPlans);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.copyPublicPlan = async (req, res) => {
  try {
    const { planId } = req.params;

    const publicPlan = await Plan.findById(planId);

    if (!publicPlan || !publicPlan.isPublic) {
      return res.status(404).json({ error: "Public plan not found." });
    }

    const newPlan = new Plan({
      userId: req.user._id,
      title: publicPlan.title,
      description: publicPlan.description,
      destination: publicPlan.destination,
      duration: publicPlan.duration,
      isPublic: false,
      days: publicPlan.days,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await newPlan.save();

    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.togglePlanVisibility = async (req, res) => {
  try {
    const { planId } = req.params;
    const { isPublic } = req.body;

    if (typeof isPublic !== "boolean") {
      return res.status(400).json({ error: "isPublic must be a boolean." });
    }

    const plan = await Plan.findOne({ _id: planId, userId: req.user._id });

    if (!plan) {
      return res.status(404).json({ error: "Plan not found." });
    }

    plan.isPublic = isPublic;
    plan.updatedAt = Date.now();

    await plan.save();

    res.json({
      message: `Plan has been ${
        isPublic ? "shared" : "unshared"
      } successfully.`,
    });
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
