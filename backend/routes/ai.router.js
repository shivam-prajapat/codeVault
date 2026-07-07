const express = require("express");
const aiController = require("../controllers/aiController");

const aiRouter = express.Router();

aiRouter.post("/review/:repoId", aiController.generateCodeReview);

module.exports = aiRouter;
