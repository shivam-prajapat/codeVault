const mongoose = require("mongoose");
const Repository = require("./models/repoModel");
const Issue = require("./models/issueModel");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log("Connected to MongoDB");
    const issues = await Issue.find({});
    console.log("All issues in DB:", issues);
    process.exit(0);
});
