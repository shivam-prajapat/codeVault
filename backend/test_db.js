require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.error("MONGODB_URI is undefined!");
    process.exit(1);
}

console.log("Attempting to connect to:", mongoURI);

mongoose.connect(mongoURI).then(() => {
    console.log("MongoDB Connected Successfully!");
    process.exit(0);
}).catch((err) => {
    console.error("Unable to connect:", err.message);
    process.exit(1);
});
