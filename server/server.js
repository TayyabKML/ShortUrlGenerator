const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();

// Connect to database
await connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

// Routes

app.use("/", require("./routes/index"));
app.use("/api/url", require("./routes/url"));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
