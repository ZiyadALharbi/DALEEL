require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/owner", require("./routes/owner.js"));
app.use("/api/place", require("./routes/place.js"));
app.use("/api/plan", require("./routes/plan.js"));


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
