require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Repository = require("./models/repoModel");

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log("Connected to MongoDB.");
    const repos = await Repository.find({});
    console.log(`Found ${repos.length} repositories in DB:`);
    console.log(repos);
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
